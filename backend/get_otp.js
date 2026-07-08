const mongoose = require('mongoose');

const mongoUrl = 'mongodb+srv://Sumit:abc%40123@cluster0.fprt1lq.mongodb.net/axiora?retryWrites=true&w=majority';

async function run() {
    try {
        await mongoose.connect(mongoUrl);
        const OTP = mongoose.connection.db.collection('otps');
        const otpRecord = await OTP.findOne({ email: 'test_school_reg_123@gmail.com' });
        console.log('OTP Record:', otpRecord);
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
