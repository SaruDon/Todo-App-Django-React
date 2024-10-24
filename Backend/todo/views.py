from django.shortcuts import render,get_object_or_404
from .models import Todo
from .serilizers import TodoSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
# Create your views here.



# Get all Todos
@api_view(["GET", "POST"])
def todo_list(request):
    if request.method == "POST":
        # serializing data to create a todo
        serializer = TodoSerializer(data=request.data)
        if serializer.is_valid():  
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    elif request.method == "GET":
        todos = Todo.objects.all()
        serializer = TodoSerializer(todos, many=True)
        return Response(serializer.data)
    

    
@api_view(["DELETE"])
def delete_all_todos():
    Todo.objects.all().delete()
    

  
# Get Todo By id
@api_view(["PUT","GET","PATCH","DELETE"])
def todo_details(request,pk):
  
  todo = get_object_or_404(Todo,id=pk) 

  if request.method =='GET':
    serializer = TodoSerializer(todo)
    return Response(serializer.data)
  
  elif request.method == 'PATCH':
    serializer = TodoSerializer(todo, data=request.data, partial=True)  # Add partial=True
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


  elif request.method == 'DELETE':
    todo.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
  