function isValidUrl(url) {
    try {
        let Url = new URL(url);
        if (Url.hostname.includes('youtube')) return true;
        else return false
    } catch (e) {
        return false;
    }
}

module.exports = {
    isValidUrl: isValidUrl,
};
