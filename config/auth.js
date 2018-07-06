module.exports = {
        'facebookAuth' : {
        'clientID'      : '1751370578288403', // your App ID
        'clientSecret'  : '217a1fb7a4f9805f264ebd1517e44c7a', // your App Secret
        'callbackURL'   : 'https://localhost:3443/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name' , 'user_relationships' , 'user_posts', 'user_photos'] // For requesting permissions from Facebook API
    },
};