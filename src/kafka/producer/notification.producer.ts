import { connectProducer, producer } from "../../config/kafka";
import { logger } from "../../config/logger";
import { TOPICS } from "../../constants/index";

export class NotificationProducer {
    private isInitialized = false;

    async initialize() {
        if (!this.isInitialized) {
            await connectProducer();
            this.isInitialized = true;
        }
    }

    async sendMessage(topic: string, key: string, data: Record<string, unknown>) {
        await this.initialize();

        const messageToSend = {
            topic,
            messages: [{
                key,
                value: JSON.stringify(data),
                timestamp: Date.now().toString()
            }]
        };

        const result = await producer.send(messageToSend);
        const firstMessage = messageToSend.messages[0];
        const metadata = result[0];
        logger.info(`Message sent to topic ${topic}`, {
            key: firstMessage?.key,
            partition: metadata?.partition,
            offset: metadata?.offset
        });
        return result;
    }

    async sendOTPAndEmail(email: string, otp: string, expiryTime = 5) {
        return this.sendMessage(
            TOPICS.OTP_EMAIL,
            `otp:-${email}`,
            { email, otp, expiryTime }
        );
    }
}
