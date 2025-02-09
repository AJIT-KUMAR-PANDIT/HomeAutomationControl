// Mock MQTT client
export class MQTTClient {
  private static instance: MQTTClient;
  private connected: boolean = false;

  private constructor() {
    this.connected = true;
    console.log("[MQTT] Connected to broker");
  }

  static getInstance(): MQTTClient {
    if (!MQTTClient.instance) {
      MQTTClient.instance = new MQTTClient();
    }
    return MQTTClient.instance;
  }

  publish(topic: string, message: string): void {
    if (!this.connected) throw new Error("MQTT client not connected");
    console.log(`[MQTT] Publishing to ${topic}: ${message}`);
  }
}

export const mqttClient = MQTTClient.getInstance();
