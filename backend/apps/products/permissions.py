"""
Custom permissions for Products app.
"""

from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Allow read access to everyone, write access only to admins.
    """
    
    def has_permission(self, request, view):
        # Allow read-only methods for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Check if user is authenticated and is admin
        return (
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_admin or request.user.is_staff)
        )
