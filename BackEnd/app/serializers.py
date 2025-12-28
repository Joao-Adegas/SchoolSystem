from rest_framework import serializers
from .models import ProfessorGestor, Ambiente, Disciplina,Sala
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

from datetime import date
import re

User = get_user_model()

class DisciplinaResumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disciplina
        fields = ['id', 'Nome']


class ProfessorGestorSerializer(serializers.ModelSerializer):

    disciplinas = DisciplinaResumoSerializer(source="disciplina_set",many=True,read_only=True)

    class Meta:
        model = ProfessorGestor
        fields = ['NI','Nome','email','Telefone','Data_de_Nascimento','Data_de_contratacao','Usuario','username','password','disciplinas']

    def validate(self, data):
        data_nascimento = data.get('Data_de_Nascimento')
        data_contratacao = data.get('Data_de_contratacao')

        # Validação de data de nascimento e contratação
        if data_nascimento and data_contratacao and data_nascimento > data_contratacao:
            raise serializers.ValidationError({"Data_de_Nascimento": "A data de nascimento não pode ser mais recente que a data de contratação."})

        if data_nascimento and data_nascimento > date.today():
            raise serializers.ValidationError({"Data_de_Nascimento": "A data de nascimento não pode ser no futuro."})

        if data_contratacao and data_contratacao > date.today():
            raise serializers.ValidationError({"Data_de_contratacao": "A data de contratação não pode ser no futuro."})

        # Validação de idade mínima (18 anos)
        if data_nascimento:
            hoje = date.today()
            idade = hoje.year - data_nascimento.year - ((hoje.month, hoje.day) < (data_nascimento.month, data_nascimento.day))
            if idade < 18:
                raise serializers.ValidationError({"Data_de_Nascimento": "O usuário deve ter pelo menos 18 anos."})

        return data

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
        fields = [
            'id', 'Data_inicio', 'Data_termino', 'Periodo', 
            'Sala_reservada', 'Disciplina_professor', 
            'numero_sala', 'professor_nome', 'disciplina_nome'
        ]

    def validate(self, data):
        data_inicio = data.get('Data_inicio')
        data_termino = data.get('Data_termino')
        periodo = data.get('Periodo')
        sala = data.get('Sala_reservada')

        reserva_existente = Ambiente.objects.filter(
            Sala_reservada=sala,
            Periodo=periodo
        ).filter(
            Data_inicio__lte=data_termino,
            Data_termino__gte=data_inicio
        ).exists()

        if reserva_existente:
            raise serializers.ValidationError(
                {"erro": "Já existe uma reserva para esta sala no mesmo período e data."}
            )

        return data

    def create(self, validated_data):
        disciplina = validated_data.get('Disciplina_professor')
        if disciplina and disciplina.Professor_responsavel:
            professor = disciplina.Professor_responsavel
        else:
            raise serializers.ValidationError(
                {"erro": "A disciplina selecionada não possui um professor responsável."}
            )

        ambiente = Ambiente.objects.create(
            **validated_data,
            Professor_responsavel=professor
        )
        return ambiente

    def update(self, instance, validated_data):
        if 'Disciplina_professor' in validated_data:
            disciplina = validated_data.get('Disciplina_professor')
            if disciplina and disciplina.Professor_responsavel:
                instance.Professor_responsavel = disciplina.Professor_responsavel
            else:
                raise serializers.ValidationError(
                    {"erro": "A disciplina selecionada não possui um professor responsável."}
                )
        return super().update(instance, validated_data)
      


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