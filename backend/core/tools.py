"""
Email tools and utilities using Composio.
"""
from typing import List, Dict, Any, Optional
from composio import Composio
from app.config.settings import get_settings


class EmailToolsService:
    """Service for email operations using Composio tools."""
    
    def __init__(self):
        """Initialize the email tools service."""
        self.settings = get_settings()
        self.composio = Composio(api_key=self.settings.composio_api_key)
    
    def get_gmail_tools(self) -> List[Dict[str, Any]]:
        """Get available Gmail tools."""
        try:
            tools = self.composio.tools.get(toolkits=["gmail"])
            return [tool.model_dump() for tool in tools]
        except Exception as e:
            raise Exception(f"Failed to get Gmail tools: {str(e)}")
    
    def execute_gmail_action(self, action: str, arguments: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Execute a Gmail action for a specific user."""
        try:
            # Use the correct method from documentation
            result = self.composio.tools.execute(
                action,
                user_id=user_id,
                arguments=arguments
            )
            return result
        except Exception as e:
            raise Exception(f"Failed to execute Gmail action: {str(e)}")
    
    def fetch_user_emails(self, user_id: str, max_results: int = 10, query: Optional[str] = None) -> List[Dict[str, Any]]:
        """Fetch emails for a user using GMAIL_FETCH_EMAILS."""
        try:
            arguments = {
                "max_results": max_results,
                "include_spam_trash": False
            }
            
            if query:
                arguments["query"] = query
            
            result = self.execute_gmail_action(
                action="GMAIL_FETCH_EMAILS",
                arguments=arguments,
                user_id=user_id
            )
            
            # Extract emails from the result
            if isinstance(result, dict):
                return result.get("emails", result.get("messages", []))
            return []
        except Exception as e:
            raise Exception(f"Failed to fetch user emails: {str(e)}")
    
    def get_email_by_id(self, user_id: str, message_id: str) -> Dict[str, Any]:
        """Get a specific email by message ID."""
        try:
            result = self.execute_gmail_action(
                action="GMAIL_FETCH_MESSAGE_BY_MESSAGE_ID",
                arguments={"message_id": message_id},
                user_id=user_id
            )
            return result
        except Exception as e:
            raise Exception(f"Failed to get email by ID: {str(e)}")

    def get_user_profile(self, user_id: str) -> Dict[str, Any]:
        """Get user profile information."""
        try:
            # Attempt to get profile first
            result = self.execute_gmail_action(
                action="GMAIL_GET_PROFILE",
                arguments={},
                user_id=user_id
            )
            # If the response is success, return it.
            if isinstance(result, dict):
                # Check if we got a name, if not, try contacts as a fallback
                data = result.get("data") or result.get("response_data") or result
                if isinstance(data, dict):
                    name = data.get("display_name") or data.get("displayName") or data.get("fullName") or data.get("name")
                    if name:
                        return result

            # Fallback to GMAIL_GET_CONTACTS if profile didn't give a name
            try:
                print(f"GMAIL_GET_PROFILE did not provide a name for {user_id}, trying GMAIL_GET_CONTACTS...")
                contacts_result = self.execute_gmail_action(
                    action="GMAIL_GET_CONTACTS",
                    arguments={"pageSize": 20},
                    user_id=user_id
                )
                if isinstance(contacts_result, dict):
                    # Combine results or just add contacts to the result
                    result["contacts_data"] = contacts_result
            except Exception as ce:
                print(f"GMAIL_GET_CONTACTS fallback failed: {ce}")

            return result
        except Exception as e:
            # If GMAIL_GET_PROFILE is not available, try to get it from contacts directly
            print(f"Warning: GMAIL_GET_PROFILE failed for {user_id}: {e}. Trying GMAIL_GET_CONTACTS directly.")
            try:
                contacts_result = self.execute_gmail_action(
                    action="GMAIL_GET_CONTACTS",
                    arguments={"pageSize": 20},
                    user_id=user_id
                )
                return {"email_address": user_id, "contacts_data": contacts_result}
            except Exception as ce:
                print(f"GMAIL_GET_CONTACTS direct attempt failed: {ce}")
                return {"email_address": user_id}
    
    def list_threads(self, user_id: str, max_results: int = 10, query: Optional[str] = None) -> List[Dict[str, Any]]:
        """List email threads."""
        try:
            arguments = {
                "max_results": max_results,
                "verbose": True
            }
            
            if query:
                arguments["query"] = query
            
            result = self.execute_gmail_action(
                action="GMAIL_LIST_THREADS",
                arguments=arguments,
                user_id=user_id
            )
            
            return result.get("threads", [])
        except Exception as e:
            raise Exception(f"Failed to list threads: {str(e)}")
    
    def send_email(self, user_id: str, to: str, subject: str, body: str) -> Dict[str, Any]:
        """Send an email for a user."""
        try:
            result = self.execute_gmail_action(
                action="GMAIL_SEND_MESSAGE",
                arguments={
                    "to": to,
                    "subject": subject,
                    "body": body
                },
                user_id=user_id
            )
            return result
        except Exception as e:
            raise Exception(f"Failed to send email: {str(e)}")
    
    def reply_to_email(self, user_id: str, thread_id: str, to: str, subject: str, body: str) -> Dict[str, Any]:
        """Reply to an email thread."""
        try:
            result = self.execute_gmail_action(
                action="GMAIL_REPLY_TO_MESSAGE",
                arguments={
                    "thread_id": thread_id,
                    "to": to,
                    "subject": subject,
                    "body": body
                },
                user_id=user_id
            )
            return result
        except Exception as e:
            raise Exception(f"Failed to reply to email: {str(e)}")