import mongoose from 'mongoose';

interface ConnectionStatus {
    isConnected: any;
}

const connection: ConnectionStatus = {
    isConnected: false
};

async function connect() {
    if (connection.isConnected) {
        console.log('Already Connected');
        return;
    }

    if (mongoose.connections && mongoose.connections.length > 0) {
        connection.isConnected = mongoose?.connections[0]?.readyState;
        if (connection.isConnected === 1) {
            console.log('use the previous connection');
            return;
        }
        await mongoose.disconnect();
    }

    const db = await mongoose.connect(process.env.MONGODB_URI!);
    connection.isConnected = mongoose.connections && mongoose?.connections[0]?.readyState;
}

async function disconnect() {
    if (connection.isConnected) {
        if (process.env.NODE_ENV === 'production') {
            await mongoose.disconnect();
            connection.isConnected = false;
        } else {
            console.log('not disconnected');
        }
    }
}

const db = { connect, disconnect };

export default db;