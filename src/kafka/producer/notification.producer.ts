import { connectProducer, producer } from "../../config/kafka";
import { logger } from "../../config/logger";
import { TOPICS } from "../../contansts/index";


export class NotificationProducer {
    private isInitialized: boolean;
    constructor() {
        this.isInitialized = false;
    }



    async initialize() {
        if (!this.isInitialized) {
            await connectProducer();
            this.isInitialized = true;
        }


    }

    async sendMessage(topic: string, message: string, data: any) {
        try {
            await this.initialize();
            // TODO: Implement actual message sending logic

            const messageToSend = {
                topic,
                message: [{
                    key: `${topic}-${Date.now()}`,
                    value: JSON.stringify(data),
                    timestamp: Date.now().toString()
                }],
                data
            };
            // TODO: Use kafka producer to send message

            const result = await producer.send(messageToSend);
            logger.info(`Message sent to topic ${topic}: ${JSON.stringify(result)}`);

        } catch (error) {
            logger.error(`Error sending message to topic ${topic}: ${error}`);
        }
    }

    async sendOTPAndEmail(email: string, otp: string, expiryTime = 5) {

        return this.sendMessage(
            TOPICS.OTP_EMAIL,
            `otp:-${email}`,
            {
                email,
                otp,
                expiryTime
            }
        )
    }
}
