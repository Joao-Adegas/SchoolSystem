from . import views
from django.urls import path


urlpatterns = [
    path('token/',view=views.LoginView.as_view() ,name='token'),

    path('professores/',view=views.ProfessorGestorListCreateView.as_view(), name='Listar_Cria_ProfessorGestor'),
    path('professores/<int:NI>',view=views.ProfessorGestorRetriveUpdateDestroyAPIView.as_view(), name='atualizar_deletar_vizualizar'),

    path('disciplina/' , view=views.DisciplinaListCreateView.as_view(), name='Listar_Cria_Disciplina'),
    path('disciplina/<int:pk>', view=views.DisciplinaRetriverUpdateDestryAPIView.as_view(),name='atualizar_deletar_vizualizar'),
 
    path('reservaAmbiente/', view=views.AmbienteListCreateView.as_view(), name='Listar_Cria_Ambiente'),
    path('reservaAmbiente/<int:pk>',view=views.AmbienteRetriverUpdateDestroyApiView.as_view(),name='atualizar_deletar_vizualizar'),

    path('sala/',view=views.SalaListCreateAPIView.as_view(),name='listar_criar_Sala'),
    path('sala/<int:pk>',view=views.SalaRetriveUpdateDestroyApiView.as_view(),name='atualizar_deletar_vizualizar'),

    path('professorDisciplinas/',view=views.ListDisciplinasProfessor.as_view(),name='ver_disciplinas_do_professor'),   
]