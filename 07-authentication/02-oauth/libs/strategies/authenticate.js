const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    if (!email) {
      done(null, false, `Не указан email`);
      return;
    }

    let user = await User.findOne({email});

    if (!user) {
      user = new User({email, displayName});
      await user.save();
    };

    done(null, user);
  } catch (err) {
    done(err, false);
  }
};
