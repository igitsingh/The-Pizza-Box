import notifee, { AndroidImportance } from '@notifee/react-native';

class NotificationService {
  constructor() {
    this.createDefaultChannels();
  }

  async createDefaultChannels() {
    await notifee.createChannel({
      id: 'order-status',
      name: 'Order Status Updates',
      desc: 'Get notified when your pizza status changes',
      importance: AndroidImportance.HIGH,
    });
  }

  async localNotification({ title, message, channelId = 'order-status' }: { title: string, message: string, channelId?: string }) {
    // Request permissions (required for iOS and Android 13+)
    await notifee.requestPermission();

    // Display a notification
    await notifee.displayNotification({
      title: title,
      body: message,
      android: {
        channelId: channelId,
        smallIcon: 'ic_launcher', // use your app icon
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
    });
  }
}

export default new NotificationService();
