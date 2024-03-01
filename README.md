**Install dependencies**

   npm init --y
   npm install express mongoose
   npm i nodemon --save-dev
   npm i dotenv
   npm i jsonwebtoken
   npm i bcrypt
   npm i nodemailer
   npm i cors

## API Endpoints

1. **User Registration**

   - **Endpoint**: `/userRegistration`
   - **Method**: `POST`

2. **User Login**

   - **Endpoint**: `/userLogin`
   - **Method**: `GET`

3. **logged User**

   - **Endpoint**: `/userLogin`
   - **Method**: `GET`

4. **Change User Password**

   - **Endpoint**: `/changepassword`
   - **Method**: `PATCH`

5. **Send User Password Reset Email**

   - **Endpoint**: `/send-reset-password-email`
   - **Method**: `POST`

6. **User Password Reset**

   - **Endpoint**: `/reset-password/:id/:token`
   - **Method**: `POST`