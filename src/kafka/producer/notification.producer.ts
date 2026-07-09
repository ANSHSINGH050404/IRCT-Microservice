import { connectProducer } from "../../config/kafka";


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
}
