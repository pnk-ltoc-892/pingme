import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject  = {}

async function connectDB(): Promise<void> {
    // Check If Connection Exists
    if(connection.isConnected){
        console.log("DataBase Connection Already Exists");
        return;
    }
    // If Not, Connect The DB
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {}); // {} - For Options
        // console.log(db);

        connection.isConnected = db.connections[0].readyState;

        console.log("DataBase Connected Successfully");
    } catch (error) {
        console.log("DataBase Connection Failed\nError: ", error);
        process.exit(1);
    }
}

export default connectDB;