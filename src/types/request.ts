export interface Request {
  _id: string;
  fromUserId: {
    _id: string;
    firstName: string;
    lastName: string;
    photoUrl: string;
    age: number;
    gender: string;
    about: string;
  };
  toUserId: string;
  status: 'accepted' | 'rejected';
}
