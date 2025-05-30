from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime

#Ja vem com email e senha
class ProfessorGestor(AbstractUser):
    NI = models.AutoField(primary_key=True)
    Nome = models.CharField(max_length=200)
    Telefone = models.CharField(max_length=100)
    Data_de_Nascimento = models.DateField(blank=True, null=True)
    Data_de_contratacao = models.DateField(blank=True, null=True)
    Usuario = models.CharField(max_length=9, choices=(
        ('Professor','Professor'),
        ('Gestor','Gestor')
    ))
    is_staff = models.BooleanField(default=True)  
    def __str__(self):
        return f"{self.Nome} - NI: {self.NI}"

class Disciplina(models.Model):
    Nome = models.CharField(max_length=200)
    Curso = models.CharField(max_length=200)
    Carga_Horaria = models.CharField(max_length=10)
    Descricao = models.TextField()
    Professor_responsavel = models.ForeignKey(ProfessorGestor,on_delete=models.CASCADE, limit_choices_to={'Usuario':'Professor'},default=1,blank=True, null=True)

    def __str__(self):
        return self.Nome   

class Sala(models.Model):
    numero = models.PositiveIntegerField()

    def __str__(self):
        return f"Sala {self.numero}"

    
class Ambiente(models.Model):
    Data_inicio = models.DateField(blank=True, null=True)
    Data_termino = models.DateField(blank=True, null=True)
    Periodo = models.CharField(max_length=10,choices=(
        ('M','Manhã'),
        ('T','Tarde'),
        ('N','Noite')
    ))
    Sala_reservada = models.ForeignKey(Sala,on_delete=models.CASCADE)
    Professor_responsavel = models.ForeignKey(ProfessorGestor,on_delete=models.CASCADE, limit_choices_to={'Usuario':'Professor'})
    Disciplina_professor = models.ForeignKey(Disciplina, on_delete=models.CASCADE, null=True, blank=True)


