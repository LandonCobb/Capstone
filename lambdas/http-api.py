import os
import decimal
import json
import enum
import logging
import boto3
import uuid

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# stripe.api_key = os.getenv('STRIPE_API_KEY')


class HttpMethod(enum.Enum):
    GET = "GET"
    POST = "POST"
    PATCH = "PATCH"
    PUT = "PUT"
    DELETE = "DELETE"
    OPTIONS = "OPTIONS"


class LambdaCTX:
    ENV = os.environ

    def __init__(self, event: dict) -> None:
        self.event = event
        self.routeKey = event.get('routeKey')
        body = event.get('body', None)
        if body is not None:
            try:
                _bdy = json.loads(body)
                self.body = _bdy
            except:
                self.body = {}
        else:
            self.body = {}
        self.query = event.get('queryStringParameters', {})
        self.path = event.get('pathParameters', {})
        self.headers = event.get('headers', {})
        self.initialized = True

    def route_is(self, method: HttpMethod, path: str) -> bool:
        if not self.initialized:
            return False
        stage = self.ENV.get('SLS_STAGE')
        return self.routeKey == f'{method.value} /{stage}{path}'

    def get_authorized_claims(self) -> dict:
        return self.event.get('requestContext', {}).get('authorizer', {}).get('jwt', {}).get('claims', {})

    @classmethod
    def get_user(self, id: str) -> dict:
        region, pool_id = self.ENV.get(
            'C_REGION'), self.ENV.get('COGNITO_POOL_ID')
        cognito = boto3.client('cognito-idp', region_name=region)
        res = cognito.admin_get_user(UserPoolId=pool_id, Username=id)
        return res

    @classmethod
    def get_user_attribute(self, user: dict, key: str) -> str:
        return next((x for x in user.get('UserAttributes', []) if x['Name'] == key), {'Value': ''})['Value']

    @classmethod
    def set_user_attributes(self, attributes: dict, id: str):
        region, pool_id = self.ENV.get('C_REGION'), self.ENV.get('COGNITO_POOL_ID')
        cognito = boto3.client('cognito-idp', region_name=region)
        cognito.admin_update_user_attributes(
            UserPoolId=pool_id, Username=id, UserAttributes=attributes)

    @classmethod
    def _default_type_error_handler(self, obj):
        if isinstance(obj, decimal.Decimal):
            return int(obj)
        raise TypeError

    @classmethod
    def send_data(self, code: int, data: dict) -> dict:
        return {
            'statusCode': code,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps(data, default=self._default_type_error_handler)
        }

    @classmethod
    def send_error(self, code: int, msg: str) -> dict:
        return self.send_data(code, {'message': msg})


# +======================================+
# |         AWS LAMBDA HANDLER           |
# +======================================+

def ping() -> dict:
    return LambdaCTX.send_data(200, {'message': 'pong'})

# /v1/rally?rallyName=test&rallyLoaction=Salt%20Lake
def get_rallies(ctx: LambdaCTX) -> dict:
    search_name = ctx.query.get('rallyName', None)
    search_loaction = ctx.query.get('rallyLocation', None)
    rally_tbl = boto3.resource("dynamodb").Table(LambdaCTX.ENV['RALLY_TBL'])
    response = rally_tbl.scan()
    rallies = response.get('Items', [])
    while 'LastEvaluatedKey' in response:
        response = rally_tbl.scan(
            ExclusiveStartKey=response['LastEvaluatedKey'])
        rallies.extend(response.get('Items', []))

    # If search vars are not none then filter `rallies` var before return
    if search_name is not None: rallies = [ rally for rally in rallies if search_name.lower() in rally['name'].lower() ]
    if search_loaction is not None: rallies = [ rally for rally in rallies if search_loaction.lower() in rally['location'].lower() ]
    return LambdaCTX.send_data(200, rallies)


def get_rally_by_id(rally_id: str) -> dict:
    rally_tbl = boto3.resource("dynamodb").Table(LambdaCTX.ENV['RALLY_TBL'])
    rally = rally_tbl.get_item(Key={'rallyId': rally_id}).get('Item', None)
    if rally is None:
        return LambdaCTX.send_error(404, 'Rally not found')
    return LambdaCTX.send_data(200, rally)


def create_rally(body: dict, user_id: str, ctx:LambdaCTX) -> dict:
    rally_tbl = boto3.resource("dynamodb").Table(LambdaCTX.ENV['RALLY_TBL'])
    body['rallyId'] = str(uuid.uuid4())
    rally_tbl.put_item(Item=body)
    rally_ids = LambdaCTX.get_user_attribute(ctx.get_user(user_id), 'custom:rallyIds')
    rally_ids = json.loads(rally_ids if rally_ids != "" else "[]")
    data = [ { 'Name': 'custom:rallyIds', 'Value': json.dumps([*rally_ids, body['rallyId']], separators=(',', ':')) } ]
    LambdaCTX.set_user_attributes(data, user_id)
    return LambdaCTX.send_data(200, body)


def delete_rally_by_id(rally_id: str) -> dict:
    rally_tbl = boto3.resource("dynamodb").Table(LambdaCTX.ENV['RALLY_TBL'])
    rally_tbl.delete_item(Key={'rallyId': rally_id})
    return LambdaCTX.send_data(204, {})

def get_vehicles(ctx: LambdaCTX) -> dict:
    vehicle_tbl = boto3.resource("dynamodb").Table(LambdaCTX.ENV['VEHICLE_TBL'])
    response = vehicle_tbl.scan()
    vehicles = response.get('Items', [])
    while 'LastEvaluatedKey' in response:
        response = vehicle_tbl.scan(
            ExclusiveStartKey=response['LastEvaluatedKey'])
        vehicles.extend(response.get('Items', []))
    return LambdaCTX.send_data(200, vehicles)

def get_vehicle_by_id(vehicle_id: str) -> dict:
    vehicle_tbl = boto3.resource("dynamodb").Table(LambdaCTX.ENV['VEHICLE_TBL'])
    vehicle = vehicle_tbl.get_item(Key={'vehicleId': vehicle_id}).get('Item', None)
    if vehicle is None:
        return LambdaCTX.send_error(404, 'Vehicle not found')
    return LambdaCTX.send_data(200, vehicle)

def create_vehicle(body: dict, user_id: str, ctx: LambdaCTX) -> dict:
    vehicle_tbl = boto3.resource("dynamodb").Table(LambdaCTX.ENV['VEHICLE_TBL'])
    body['vehicleId'] = str(uuid.uuid4())
    vehicle_tbl.put_item(Item=body)
    # ASK CARTER
    # rally_ids = LambdaCTX.get_user_attribute(ctx.get_user(user_id), 'custom:rallyIds')
    # rally_ids = json.loads(rally_ids if rally_ids != "" else "[]")
    # data = [ { 'Name': 'custom:rallyIds', 'Value': json.dumps([*rally_ids, body['rallyId']], separators=(',', ':')) } ]
    # LambdaCTX.set_user_attributes(data, user_id)
    return LambdaCTX.send_data(200, body)

def delete_vehicle_by_id(vehicle_id: str) -> dict:
    vehicle_tbl = boto3.resource("dynamodb").Table(LambdaCTX.ENV['VEHICLE_TBL'])
    vehicle_tbl.delete_item(Key={'vehicleId': vehicle_id})
    return LambdaCTX.send_data(204, {})

def main(event, l_context):
    try:
        ctx = LambdaCTX(event)

        if ctx.route_is(HttpMethod.GET, '/ping'):
            return ping()
        elif ctx.route_is(HttpMethod.GET, '/rally'):
            return get_rallies(ctx)
        elif ctx.route_is(HttpMethod.GET, '/rally/{rallyId}'):
            rally_id = ctx.path.get('rallyId', None)
            if rally_id is None:
                return LambdaCTX.send_error(400, 'Missing data')
            return get_rally_by_id(rally_id)
        elif ctx.route_is(HttpMethod.POST, '/rally'):
            username = ctx.get_authorized_claims().get('username', None)
            if username is None:
                return LambdaCTX.send_error(401, "Invalid clams")
            return create_rally(ctx.body, username, ctx)
        elif ctx.route_is(HttpMethod.DELETE, '/rally/{rallyId}'):
            rally_id = ctx.path.get('rallyId', None)
            if rally_id is None:
                return LambdaCTX.send_error(400, 'Missing data')
            username = ctx.get_authorized_claims().get('username', None)
            if username is None:
                return LambdaCTX.send_error(401, "Invalid clams")
            rally_ids = LambdaCTX.get_user_attribute(
                ctx.get_user(username), 'custom:rallyIds')
            rally_ids = json.loads(rally_ids if rally_ids != "" else "[]")
            if rally_id not in rally_ids:
                return LambdaCTX.send_error(403, "You do not own this rally")
            return delete_rally_by_id(rally_id)
        elif ctx.route_is(HttpMethod.GET, '/vehicle'):
            return get_vehicles(ctx)
        elif ctx.route_is(HttpMethod.GET, '/vehicle/{vehicleId}'):
            vehicle_id = ctx.path.get('vehicleId', None)
            if vehicle_id is None:
                return LambdaCTX.send_error(400, 'Missing data')
            return get_vehicle_by_id(vehicle_id)
        elif ctx.route_is(HttpMethod.POST, '/vehicle'):
            #ask carter
            pass
        elif ctx.route_is(HttpMethod.DELETE, '/vehicle/{vehicleId}'):
            #ask farter
            pass

        else:
            LambdaCTX.send_error(404, 'Not found')
    except Exception as e:
        logger.exception(getattr(e, 'message', repr(e)))
        return LambdaCTX.send_error(500, getattr(e, 'message', repr(e)))
