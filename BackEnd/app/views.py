from django.shortcuts import render

from .models import ProfessorGestor, Ambiente , Disciplina,Sala
from .serializers import ProfessorGestorSerializer, LoginSerializer, DisciplinaSerializer,AmbienteSerializer,SalaSerializer
from .permissions import IsGestor,IsGestpoOrProfessor,IsProfessor

from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView,ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from rest_framework_simplejwt.views import TokenObtainPairView


from rest_framework.views import APIView



class ProfessorLogadoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfessorGestorSerializer(request.user)
        return Response(serializer.data)


# ProfessorGestor
class ProfessorGestorListCreateView(ListCreateAPIView):
    queryset = ProfessorGestor.objects.all()
    serializer_class = ProfessorGestorSerializer
    permission_classes = [IsGestor]
    
    def perform_create(self, serializer):
        new_username = serializer.validated_data.get('username', '').strip()
        if ProfessorGestor.objects.filter(username=new_username).exists():
            raise ValidationError({"username": "Nome de usuário já existe."})
        serializer.save()

class ProfessorGestorRetriveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = ProfessorGestor.objects.all()
    serializer_class = ProfessorGestorSerializer
    permission_classes = [IsGestor]
    lookup_field = 'NI'

    def perform_destroy(self, instance):
        instance.delete()
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"detail": "Registro deletado com sucesso."},
            status=status.HTTP_200_OK
        )


class DisciplinaListCreateView(ListCreateAPIView):
    # queryset = Disciplina.objects.all()
    serializer_class = DisciplinaSerializer

    def get_queryset(self):
        usuario = self.request.user

        if(usuario.Usuario == 'Gestor'):
            return Disciplina.objects.all()
        elif(usuario.Usuario == 'Professor'):
            return Disciplina.objects.filter(Professor_responsavel = usuario)

    def perform_create(self, serializer):
        return serializer.save()
    
class DisciplinaRetriverUpdateDestryAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Disciplina.objects.all()
    serializer_class = DisciplinaSerializer
    permission_classes = [IsGestor]
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return instance.delete()
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"detail": "Disciplina deletada com sucesso."},
            status=status.HTTP_200_OK
        )
    

# Sala

class SalaListApiView(ListAPIView):
    queryset = Sala.objects.all()
    serializer_class = SalaSerializer
    permission_classes = [IsAuthenticated]

class SalaListCreateAPIView(ListCreateAPIView):
    queryset = Sala.objects.all()
    serializer_class = SalaSerializer
    permission_classes = [IsGestor]
    lookup_fields = 'pk'


    def perform_create(self,serializer):
        return serializer.save()

class SalaRetriveUpdateDestroyApiView(RetrieveUpdateDestroyAPIView):
    queryset = Sala.objects.all()
    serializer_class = SalaSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return instance.delete()
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"detail": "Sala deletada com sucesso."},
            status=status.HTTP_200_OK
        )

# Ambiente
class AmbienteListCreateView(ListCreateAPIView):
    serializer_class = AmbienteSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk' 

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True) 
            return super().create(request,args,kwargs)
        except Exception as e:
            print(e)
            if(serializer.errors):
                return Response(serializer.errors,status=status.HTTP_409_CONFLICT)
        
        # if serializer.errors:  
        #     return Response(serializer.errors, status=status.HTTP_409_CONFLICT)
        # return super().create(request, args, kwargs)

    def get_queryset(self):
        usuario = self.request.user

        if(usuario.Usuario == 'Gestor'):
            return Ambiente.objects.all()
        elif(usuario.Usuario == 'Professor'):
            return Ambiente.objects.filter(Professor_responsavel = usuario)
        
    def perform_create(self, serializer):
        return serializer.save()
    
   

class AmbienteRetriverUpdateDestroyApiView(RetrieveUpdateDestroyAPIView):
    queryset = Ambiente.objects.all()
    serializer_class = AmbienteSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return instance.delete()
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"detail": "Ambiente deletado com sucesso."},
            status=status.HTTP_200_OK
        )

# List Dicsiplina 

class ListDisciplinasProfessor(ListAPIView):
    serializer_class = DisciplinaSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        usuario = self.request.user
        return Disciplina.objects.filter(Professor_responsavel = usuario)

# login
class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    
