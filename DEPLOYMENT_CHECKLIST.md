## RENDER DEPLOYMENT CHECKLIST

### CRITICAL: Set these Environment Variables in Render Dashboard

1. **MONGO_URL**
   ```
   mongodb+srv://santoshsantu92067_db_user:santu123@cluster1.j98wqmk.mongodb.net/smarthealth?retryWrites=true&w=majority&appName=Cluster1
   ```

2. **JWT_SECRET**
   ```
   your_super_secure_jwt_secret_key_here_change_this_in_production
   ```

3. **NODE_ENV**
   ```
   production
   ```

### OPTIONAL (for notifications):
4. **TWILIO_ACCOUNT_SID** - your_twilio_account_sid
5. **TWILIO_AUTH_TOKEN** - your_twilio_auth_token  
6. **TWILIO_FROM** - your_twilio_phone_number

### DEPLOYMENT STEPS:
1. Set environment variables in Render dashboard
2. Push code changes
3. Wait for deployment
4. Test login with: admin/admin123, receptionist/recep123, doctor1/doc123

### TEST ENDPOINTS:
- API Test: https://smart-health-web.onrender.com/api/auth/test
- Frontend: https://smart-health-web.onrender.com