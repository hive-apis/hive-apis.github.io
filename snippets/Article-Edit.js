/* Quickly jump to the edit page for the current article (Swarm & WP Posts) */
(() => {
    if (_WF.cache.getItem(_WF.KEYS.ISSWARMPOST)) {
        window.open(`https://swarm.hivemedia.com/slideshow/${_WF.cache.getItem(_WF.KEYS.SWARMPOSTID)}`, '_blank').focus();
    } else {
        const origin = window.location.origin;
        const postId = _WF.cache.getItem(_WF.KEYS.POSTID);
        const editUrl = `${origin}/wp-admin/post.php?post=${postId}&action=edit`;
        if (postId && postId > 0) {
            window.open(editUrl, '_blank ');
        } else {
            window.open(`${origin}/wp-admin/edit.php`, '_blank ').focus();
        }
    }
})();