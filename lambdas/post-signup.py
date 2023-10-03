import logging, os, boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# +======================================+
# |        COGNITO INTERACTION           |
# +======================================+
def addUserAttributes(attributes:dict, usr_id:str, pool_id:str):
    region = os.getenv('COGNITO_REGION')
    cognito = boto3.client('cognito-idp', region_name=region)
    res = cognito.admin_update_user_attributes(UserPoolId=pool_id, Username=usr_id, UserAttributes=attributes)
    return res

# +======================================+
# |         AWS LAMBDA HANDLER           |
# +======================================+
def main(event, l_context):
    try:
        logger.info(event)
        data = [{ 'Name': 'custom:rallies', 'Value': "[]"}]
        addUserAttributes(data, event['userName'], 'Rally-UserPool')    
    except Exception as e:
        logger.exception(getattr(e, 'message', repr(e)))
    return event
