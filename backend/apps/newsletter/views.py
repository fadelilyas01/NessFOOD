
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Subscriber
from .serializers import SubscriberSerializer

class SubscribeView(APIView):
    def post(self, request):
        serializer = SubscriberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Inscription réussie !'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
