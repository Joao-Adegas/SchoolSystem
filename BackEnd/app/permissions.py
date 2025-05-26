from rest_framework.permissions import BasePermission

from .models import ProfessorGestor
"""
Gestores:

  - Cadastram Professores

  -  CRUD de Professores, Disciplinas e Ambientes

  - Autenticação e Autorização: Implementar um sistema de autenticação simples para garantir que apenas os Gestores possam realizar ações de cadastro, atualização e exclusão. Além disso, deve ser garantido que os professores tenham apenas acesso para visualizar as sobre as Disciplinas e as reservas de salas às quais estão vinculados.

"""

class IsGestor(BasePermission):
    def has_permission(self, request, view):
        if(request.user.is_authenticated and request.user.Usuario == 'Gestor'):
            return True
        return False
    
class IsProfessor(BasePermission):
    def has_permission(self, request, view):
        if(request.user.is_authenticated and request.user.Usuario == 'Professor'):
            return True
        else:
            return False
    
class IsGestpoOrProfessor(BasePermission):
    def has_permission(self, request, view,obj):
        if(request.user.is_authenticated and request.user.Usuario == 'Gestor' or request.user.is_authenticated and request.user.Usuario == 'Professor'):
            return True
        else:
            return obj.id == request.user.id