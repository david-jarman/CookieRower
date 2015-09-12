chrome.runtime.onMessage.addListener(function(message, sender) {
    if ((message.from === 'content') && (message.subject === 'showPageAction')) {
        chrome.pageAction.show(sender.tab.id);
    }
	else if ((message.from === 'content') && (message.subject === 'updateStatus')) {
		chrome.storage.sync.set({'status': message.status});
		chrome.runtime.sendMessage({
			status: message.status,
			from: 'eventPage',
			subject: 'updateStatus'});
	}
});