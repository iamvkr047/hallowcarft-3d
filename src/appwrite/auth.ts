import { ID, OAuthProvider } from 'appwrite';
import { account } from './index';

/** SIGNUP */
export const signupUser = async (name: string, email: string, password: string) => {
  try {
    await account.create({
      userId: ID.unique(),
      email: email,
      password: password,
      name: name,
    });
    // Automatically log in after registration
    await account.createEmailPasswordSession({
      email: email,
      password: password,
    });
    const user = await account.get();
    return {
      success: true,
      data: user,
      message: 'user signup succesfully',
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

/** LOGIN */
export const loginUser = async (email: string, password: string) => {
  try {
    await account.createEmailPasswordSession({
      email: email,
      password: password,
    });
    const user = await account.get();
    return { success: true, data: user, message: 'user login succesfully' };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

/** Get the currently logged in user. */
export const getUser = async () => {
  try {
    const response = await account.get();
    return { success: true, data: response, message: 'found user' };
  } catch (error) {
    return {
      success: false,
      message: 'getUser :: Error: ' + (error as Error).message,
    };
  }
};
export const createMyJWT = async () => {
  try {
    const response = await account.createJWT();
    if (response.jwt) {
      return response.jwt;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/** signin with google */
export const signInWithGoogle = () => {
  const baseUrl = window.location.origin;
  try {
    account.createOAuth2Token({
      provider: OAuthProvider.Google,
      success: `${baseUrl}/auth/success`, // redirect here on success
      failure: `${baseUrl}/auth/failed`, // redirect here on failure
    });
  } catch (error) {}
};
export const CreateNewSession = async (userId: string, secret: string) => {
  try {
    const session = await account.createSession({
      secret: secret,
      userId: userId,
    });
    return { success: true, data: session, message: 'session create success' };
  } catch (error) {
    return {
      success: false,
      message: 'getUser :: Error: ' + (error as Error).message,
    };
  }
};
export const getSession = async () => {
  try {
    const session = await account.getSession({ sessionId: 'current' });
    // Provider information
    // console.log(session.provider);
    // console.log(session.providerUid);
    // console.log(session.providerAccessToken);
    return { success: true, data: session, message: 'found session' };
  } catch (error) {
    return {
      success: false,
      message: 'getUser :: Error: ' + (error as Error).message,
    };
  }
};

/** LOGOUT */
export const logoutUser = async () => {
  try {
    await account.deleteSession({ sessionId: 'current' });
    return { success: true, message: 'logout user' };
  } catch (error) {
    return {
      success: false,
      message: 'logoutUser :: Error: ' + (error as Error).message,
    };
  }
};
