# Database Test Data Setup

This directory contains scripts to initialize the Smart Health database with comprehensive test data.

## Collections Created

The test data includes the following collections:

### 1. **Departments** (4 records)
- Cardiology
- Orthopedics  
- Pediatrics
- General Medicine

### 2. **Users** (4 records)
- Admin user
- Receptionist user
- Doctor users

### 3. **Doctors** (12 records)
- 3 doctors per department
- Each with specialization and contact info

### 4. **Shifts** (13 records)
- Weekly schedules for all doctors
- Different time slots and days

### 5. **Patients** (5 records)
- Sample patient data with demographics

### 6. **Notifications** (5 records)
- SMS, email, and push notifications
- Different status types (sent, pending, failed)

## Usage

### Option 1: View Test Data Structure
```bash
npm run create-test-data
```

### Option 2: Initialize Database (requires valid MongoDB connection)
```bash
npm run init-db
```

### Option 3: Original Seed Script
```bash
npm run seed
```

## Test Login Credentials

- **Admin**: `admin` / `admin123`
- **Receptionist**: `receptionist` / `recep123`  
- **Doctor**: `doctor1` / `doc123`

## Database Connection

Make sure your `.env` file has a valid `MONGO_URL` connection string:

```env
MONGO_URL=mongodb://localhost:27017/smart_health_test
# OR for MongoDB Atlas:
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database
```

## Files

- `create_test_data.js` - Displays test data structure
- `init_db.js` - Initializes database with test data
- `seed.js` - Original seed script (updated with notifications and shifts)