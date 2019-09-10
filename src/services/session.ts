import Auth from '@aws-amplify/auth';

(window as any).Auth = Auth;

class SessionService {
  public configure(configs: any) {
    Auth.configure(configs);
  }
  public currentSession() {
    return Auth.currentSession();
  }

  public async userData() {
    const async = await Auth.currentSession();
    return async.getIdToken().payload;
  }

  public signOut() {
    return Auth.signOut();
  }
}

const sessionService = new SessionService();
export default sessionService;
