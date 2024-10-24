from django.urls import path
from . import views


urlpatterns =[
  path("todos", views.todo_list),
  path("todosd", views.delete_all_todos),
  path("todos/<int:pk>", views.todo_details)
]

# urls:
  # http://127.0.0.1:8000/todos
  # http://127.0.0.1:8000/todos/id