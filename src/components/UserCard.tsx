interface UserProps {
  firstName: string;
  lastName: string;
  photoUrl: string;
  age: number;
  gender: string;
  about: string;
}

const UserCard = ({ user }: { user: UserProps }) => {
  const { firstName, lastName, photoUrl, age, gender, about } = user;
  return (
    <div className="card bg-base-300 w-80 shadow-xl">
      <figure>
        <img
          className="w-full h-72 object-contain rounded-t-lg"
          src={photoUrl}
          alt="photo"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        {age && gender && <p>{age + ", " + gender}</p>}
        <p>{about}</p>
        <div className="card-actions justify-center my-4">
          <button
            className="btn btn-primary"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
