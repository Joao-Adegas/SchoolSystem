from rest_framework import serializers
from .models import ProfessorGestor, Ambiente, Disciplina,Sala
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

User = get_user_model()

class ProfessorGestorSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProfessorGestor
        fields = ['NI','Nome','Telefone','Data_de_Nascimento','Data_de_contratacao','Usuario','username','password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        professor = ProfessorGestor(**validated_data)
        professor.set_password(password)
        professor.save()
        return professor

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password')) 
        return super().update(instance, validated_data)


class DisciplinaSerializer(serializers.ModelSerializer):
    professor_nome = serializers.CharField(source='Professor_responsavel.Nome', read_only=True)
    disciplina = serializers.CharField(source='Professor_responsavel.Nome',read_only=True)
    class Meta:
        model = Disciplina
        fields = ['id','Nome','Curso','Carga_Horaria','Descricao','Professor_responsavel','professor_nome','disciplina']



class AmbienteSerializer(serializers.ModelSerializer):

    numero_sala = serializers.IntegerField(source='Sala_reservada.numero', read_only=True)
    professor_nome = serializers.CharField(source='Professor_responsavel.Nome', read_only=True)
    disciplina_nome = serializers.CharField(source='Disciplina_professor.Nome', read_only=True)  

    class Meta:
        model = Ambiente
        fields = ['id','Data_inicio','Data_termino','Periodo','Sala_reservada','Professor_responsavel','numero_sala','professor_nome','disciplina_nome']



class SalaSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Sala
        fields = ['id','numero']



class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['usuario'] = {
            'username':self.user.username,
            'tipo':self.user.Usuario,
            'nome':self.user.Nome
        }

        return data
    
#SERIALIZER DE SALA