// backend/utils/notification.js
import Notification from '../models/notification.model.js';


/**
* createNotification helper
* options: { user, actor, type, title, message, referenceId, url, meta }
*/
export async function notify(options = {}) {
    const { user, actor = null, type, title, message, referenceId = null, url = null, meta = {} } = options;
    if (!user || !type || !title) throw new Error('user, type, title required');


    const payload = { user, actor, type, title, message, referenceId, url, meta };
    const created = await Notification.create(payload);
    // No socket emit — clients are expected to poll or use SSE/web-push.
    return created;
}