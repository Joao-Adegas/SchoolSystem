from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin

class UsuarioAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Novos Campos',{"fields":("Usuario",)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Cargo",{'fields':('Usuario',)}),
    )

admin.site.register(ProfessorGestor,UsuarioAdmin)


# Register your models here.

