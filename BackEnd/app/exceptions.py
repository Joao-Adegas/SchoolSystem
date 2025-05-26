# app/exceptions.py
from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    # Primeiro, obtenha a resposta padrão do DRF
    response = exception_handler(exc, context)
    
   
    if response is not None and response.status_code == 403:
        # Aqui você pode personalizar a mensagem conforme desejado
        response.data['detail'] = "VOCÊ NÃO POSSUI PERMISSÃO PARA FAZER LOGIN COMO PROFESSOR"

    if response is not None and response.status_code == 401:
        # Aqui você pode personalizar a mensagem conforme desejado
        response.data['detail'] = "VOCÊ NÃO POSSUI AUTORIZAÇÃO."
        response.data['code'] = "TOKEN INVALIDO"

    return response
