1. Call GET auth/csrf once per session to get csrf token (does NOT matter if user logged or not, this must be very first request per session)
2. Attach it to every client request header as "x-csrf-token": <csrfToken>
3. Create user by calling POST auth/register
4. Log in user by calling POST auth/login/email with user credentials to get access token and refresh token
5. Use access token in "Authorization: Bearer <access_token>" header to access protected endpoints
6. Use POST auth/refresh to get new access and refresh tokens (you should not provide anything in request BODY)

Note: refresh token is not returned to the client in response body, it is attached by server in "refresh_token" httpOnly cookie and automatically sent by browser to get new access and refresh tokens
