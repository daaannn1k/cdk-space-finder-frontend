import { SyntheticEvent, useState } from "react";
import { NavLink } from "react-router-dom";
import { DataService } from "../../services/DataService";

type CreateSpaceProps = {
  dataService: DataService;
};

type CustomEvent = {
    target: HTMLInputElement
}

export default function CreateSpace({ dataService }: CreateSpaceProps) {
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [photo, setPhoto] = useState<File | undefined>();
  const [actionResult, setActionResult] = useState<string>("");

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (name && location) {
      const id = await dataService.createSpace(name, location, photo)
      setActionResult(`Created space with id ${id}`);
      setName('');
      setLocation('');
    } else {
      setActionResult('Please provide a name and a location!')
    }


  };

  function setPhotoUrl(event: CustomEvent){
    console.log('EVENT', event);
    console.log('EVENT TARGET FILES', event.target.files);

    if (event.target.files && event.target.files[0]) {
        setPhoto(event.target.files[0]);
    }
  }

  function renderPhoto() {
    if (photo) {
        const localPhotoURL = URL.createObjectURL(photo)
        console.log('LOCALPHOTOURL', localPhotoURL);
        return (
          <div className='flex justify-center'>
            <img alt='' src={localPhotoURL} style={{ maxWidth: "200px" }} />
          </div>
        )
    }
  }

  function renderForm(){
    console.log('ISAUTHORIZED', dataService.isAuthorized());
    if (!dataService.isAuthorized()) {
      return<NavLink to={"/login"}>Please login</NavLink>
    }
    return (
      <form className='flex flex-col w-1/2 mt-5' onSubmit={(e) => handleSubmit(e)}>
        <div className='flex flex-col md:flex-row lg:justify-center pt-2 pb-2'>
          <label className='md:w-28'>Name:</label>
          <input className='border-2 rounded-md border-slate-200 shadow-sm lg:w-52' value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className='flex flex-col md:flex-row lg:justify-center pt-2 pb-2'>
          <label className='md:w-28'>Location:</label>
          <input className='border-2 rounded-md border-slate-200 shadow-sm lg:w-52' value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div className='flex flex-col md:flex-row justify-center items-center pt-2 pb-2'>
          <label className='md:w-28'>Photo:</label>
          <input className='flex' type="file" onChange={(e) => setPhotoUrl(e)} />
        </div>
        {renderPhoto()}
        <div className='flex justify-center'>
          <input className='p-2 mt-5 w-1/3 bg-slate-400 text-white rounded-md' type="submit" value='Create space'/>
        </div>
      </form>
    );
  }

  return <div className='flex flex-col justify-center items-center'>
    {renderForm()}
    {actionResult ? <h3>{actionResult}</h3>: undefined}
  </div>


}