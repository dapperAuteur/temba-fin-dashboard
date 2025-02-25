# Setting Up Local MongoDB for Development

This guide will help you set up a local MongoDB instance to work with the Financial Dashboard Tool. This is particularly useful when:

- You're developing without internet access
- The cloud MongoDB instance is unavailable
- You want to test changes without affecting production data

## Step 1: Install MongoDB Community Edition

### For Windows:

1. Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Select the latest version, Windows, and MSI package
3. Download and run the installer
4. Follow the installation wizard (choose "Complete" setup)
5. You can install MongoDB Compass (the GUI) when prompted
6. After installation, MongoDB runs as a service by default

### For macOS:

Using Homebrew:
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

### For Linux (Ubuntu):

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
```

## Step 2: Verify MongoDB is Running

Open a terminal/command prompt and run:

```bash
# Check if MongoDB is running
mongosh
```

You should see the MongoDB shell connect to the local instance:

```
Current Mongosh Log ID: ...
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.x
Using MongoDB:          6.0.x
...
```

Type `exit` to leave the MongoDB shell.

## Step 3: Create the Database

Our application will automatically create the database and collections when they're first used, but you can manually create them:

```bash
mongosh
```

Then in the MongoDB shell:

```javascript
// Create our database
use financial_dashboard

// Create a test document in the users collection
db.users.insertOne({ name: "Test User", email: "test@example.com" })

// Verify it was created
db.users.find()
```

## Step 4: Configure the Financial Dashboard Tool

1. Create a `.env.local` file in the root of your project if you don't already have one
2. Add your MongoDB connection string (the app will fall back to local if this fails):

```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/financial_dashboard
```

## Switching Between Cloud and Local MongoDB

With our new implementation, you can easily switch between cloud and local MongoDB:

- **To use cloud MongoDB**: Make sure `MONGODB_URI` is set correctly in `.env.local`
- **To force local MongoDB**: Either comment out the `MONGODB_URI` line in `.env.local` or set it to an invalid value

## Troubleshooting Local MongoDB

If you can't connect to your local MongoDB:

1. Check if the service is running:
   - Windows: Open Services app and look for "MongoDB"
   - macOS: Run `brew services list`
   - Linux: Run `sudo systemctl status mongod`

2. Check if it's listening on the default port:
   ```bash
   # Should show something listening on port 27017
   netstat -an | grep 27017
   ```

3. Check MongoDB logs:
   - Windows: `C:\Program Files\MongoDB\Server\6.0\log\mongod.log`
   - macOS: `/usr/local/var/log/mongodb/mongo.log`
   - Linux: `/var/log/mongodb/mongod.log`

## For Job Interviews and Client Presentations

This local MongoDB setup is perfect for demonstrations during job interviews or client meetings:

1. **Set up before the meeting**: Install and configure MongoDB locally
2. **Bring backup data**: Export some sample data from your cloud instance and import it locally
3. **Test offline**: Practice your demo with WiFi turned off to make sure it works
4. **Highlight the fallback feature**: This shows your attention to detail and concern for reliability

Demonstrating that your app can work offline shows that you've thought about real-world usage scenarios and prepared for potential issues - exactly the kind of foresight employers and clients value!
