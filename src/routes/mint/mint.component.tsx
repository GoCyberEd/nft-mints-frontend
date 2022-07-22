import { useState, ChangeEvent, useEffect } from "react";
import { Dropzone, FileItem, FileValidated } from "@dropzone-ui/react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";

import CircularProgressWithLabel from "../../components/progress-with-label/progress-with-label.component";
import {
  AreaInput,
  BasicInput,
  SpecialInput,
  MintButton,
} from "../../components/mint-input/mint-input.component";
import { createCollection } from "../../utils/mint-interface/mint-inteface.utils";
import { addFilesToStorage } from "../../utils/firebase/firebase.utils";
import { ApiResponseType } from "../../types";
import Logo from "../../assets/imgs/dj3n_logo.svg";

import "./mint.styles.scss";

const defaultFormFields = {
  name: "",
  description: "",
  link: "",
  amount: 0,
  price: 0,
};

const defaultMintResponse: ApiResponseType = {
  data: undefined,
  status: 0,
};

//const BASE_URL = process.env.REACT_APP_BASE_URL;

const Mint = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState<FileValidated[]>([]);
  const [filesUrl, setFilesUrl] = useState<string[]>([]);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [mintResponse, setMintResponse] = useState(defaultMintResponse);

  const { name, description, link, amount, price } = formFields;

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addFilesToStorage(files, setUploadProgress, setFilesUrl);
  }

  useEffect(() => {
    console.log('mint hhook');
    const insertCollection = async () => {
      const userId = "000000bb-d41b-4d00-be7a-bb39641cd9c4"; //EDDIE DB "";
      createCollection(
        filesUrl[0],
        name,
        description,
        link,
        price,
        amount,
        userId
      ).then((response) => {
        console.log('then create collection');
        setMintResponse(response!);
        setFormFields(defaultFormFields);
        setFiles([]);
      });
    }
    
    if (filesUrl.length > 0) {
      console.log('mint hhook IF');
      insertCollection();
    }
    // eslint-disable-next-line
  },[filesUrl])

  const updateFiles = (incommingFiles: FileValidated[]) => {
    setFiles(incommingFiles);
  };

  const handleDelete = (id: string | number | undefined) => {
    setFiles(files.filter((x) => x.id !== id));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mint-container">
        <img src={Logo} alt="dj3n logo" />
        {uploadProgress > 0 ? (
          <div className="mint-processing-container">
            <h2>Uploading media...</h2>
            <CircularProgressWithLabel value={uploadProgress} />
            {uploadProgress === 100 && (
              <>
                <h2>Creating Collection...</h2>
                {mintResponse.status === 0 ? (
                  <CircularProgress />
                ) : (
                  <>
                    <CircularProgressWithLabel value={100} />
                    <h1>Congratulations!</h1>
                    <h2>You succesfully create your Collection</h2>
                    <p>Use the following link to share your collection</p>
                    <p>
                      <Link to={`checkout/${mintResponse.data.uuid}`}>
                        LINK
                      </Link>
                      {/* <a
                        href={`${BASE_URL}/checkout/${mintResponse.data.uuid}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        LINK
                      </a> */}
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        ) : (
          <Stack
            direction="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <h2>Drag and Drop your NFT file</h2>
            <Dropzone
              onChange={updateFiles}
              value={files}
              accept={"audio/*, video/*, image/*"}
              maxFileSize={104857600}
              label={"Drop Files here\nor click to browse"}
              minHeight={"195px"}
              maxHeight={"500px"}
              disableScroll
              footer={false}
              style={{ marginBottom: "5%" }}
            >
              {files.map((file) => (
                <FileItem
                  {...file}
                  key={file.id}
                  onDelete={handleDelete}
                  alwaysActive
                  preview
                  info
                  elevation={1}
                  resultOnTooltip
                />
              ))}
            </Dropzone>

            <BasicInput
              label="Name *"
              name="name"
              placeholder="Item name"
              required={true}
              type="text"
              onChange={handleChange}
            />
            <AreaInput
              label="Description *"
              name="description"
              placeholder="Fill in the detailed desceiption of your NFT"
              required={true}
              type="text"
              onChange={handleAreaChange}
            />
            <BasicInput
              label="External link *"
              name="link"
              placeholder="Ex: https://www.harmony.one"
              required={true}
              type="text"
              onChange={handleChange}
            />
            <div className="quantity-price-container">
              <div className="quantity-price-title">
                <h2>Choose Quantity and Price</h2>
              </div>
              <div className="quantity-price-input">
                <SpecialInput
                  label="Amount *"
                  name="amount"
                  placeholder="0"
                  required={true}
                  type="number"
                  onChange={handleChange}
                />

                <SpecialInput
                  label="Price *"
                  name="price"
                  placeholder="0"
                  required={true}
                  type="number"
                  onChange={handleChange}
                />
              </div>
            </div>
            <MintButton label={"Create"} disabled={files.length === 0} />
          </Stack>
        )}
      </div>
    </form>
  );
};

export default Mint;



// import { useState, ChangeEvent } from "react";
// import { Dropzone, FileItem, FileValidated } from "@dropzone-ui/react";
// import Stack from "@mui/material/Stack";
// import CircularProgress from "@mui/material/CircularProgress";
// import { Link } from "react-router-dom";

// import CircularProgressWithLabel from "../../components/progress-with-label/progress-with-label.component";
// import {
//   AreaInput,
//   BasicInput,
//   SpecialInput,
//   MintButton,
// } from "../../components/mint-input/mint-input.component";
// import { createCollection } from "../../utils/mint-interface/mint-inteface.utils";
// import { addFilesToStorage } from "../../utils/firebase/firebase.utils";
// import { ApiResponseType } from "../../types";
// import Logo from "../../assets/imgs/dj3n_logo.svg";

// import "./mint.styles.scss";

// const defaultFormFields = {
//   name: "",
//   description: "",
//   link: "",
//   amount: 0,
//   price: 0,
// };

// const defaultMintResponse: ApiResponseType = {
//   data: undefined,
//   status: 0,
// };

// //const BASE_URL = process.env.REACT_APP_BASE_URL;

// const Mint = () => {
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [files, setFiles] = useState<FileValidated[]>([]);
//   const [filesUrl, setFilesUrl] = useState<string[]>([]);
//   const [formFields, setFormFields] = useState(defaultFormFields);
//   const [mintResponse, setMintResponse] = useState(defaultMintResponse);

//   const { name, description, link, amount, price } = formFields;

//   const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     console.log(name, description, link, amount, price);
//     addFilesToStorage(files, setUploadProgress, setFilesUrl).then((f) => {
//       setFilesUrl(f);
//       console.log("AHORA SI", f, f[0],Array(f).at(0));
//       const userId = "000000bb-d41b-4d00-be7a-bb39641cd9c4"; //EDDIE DB "";
//       createCollection(
//         f[0],
//         name,
//         description,
//         link,
//         price,
//         amount,
//         userId
//       ).then((response) => {
//         console.log('then create collection');
//         setMintResponse(response!);
//         setFormFields(defaultFormFields);
//         setFiles([]);
//       });
//     });
//   };

//   const updateFiles = (incommingFiles: FileValidated[]) => {
//     setFiles(incommingFiles);
//   };

//   const handleDelete = (id: string | number | undefined) => {
//     setFiles(files.filter((x) => x.id !== id));
//   };

//   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setFormFields({ ...formFields, [name]: value });
//   };

//   const handleAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
//     const { name, value } = event.target;
//     setFormFields({ ...formFields, [name]: value });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="mint-container">
//         <img src={Logo} alt="dj3n logo" />
//         {uploadProgress > 0 ? (
//           <div className="mint-processing-container">
//             <h2>Uploading media...</h2>
//             <CircularProgressWithLabel value={uploadProgress} />
//             {uploadProgress === 100 && (
//               <>
//                 <h2>Creating Collection...</h2>
//                 {mintResponse.status === 0 ? (
//                   <CircularProgress />
//                 ) : (
//                   <>
//                     <CircularProgressWithLabel value={100} />
//                     <h1>Congratulations!</h1>
//                     <h2>You succesfully create your Collection</h2>
//                     <p>Use the following link to share your collection</p>
//                     <p>
//                       <Link to={`checkout/${mintResponse.data.uuid}`}>
//                         LINK
//                       </Link>
//                       {/* <a
//                         href={`${BASE_URL}/checkout/${mintResponse.data.uuid}`}
//                         target="_blank"
//                         rel="noreferrer"
//                       >
//                         LINK
//                       </a> */}
//                     </p>
//                   </>
//                 )}
//               </>
//             )}
//           </div>
//         ) : (
//           <Stack
//             direction="column"
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <h2>Drag and Drop your NFT file</h2>
//             <Dropzone
//               onChange={updateFiles}
//               value={files}
//               accept={"audio/*, video/*, image/*"}
//               maxFileSize={104857600}
//               label={"Drop Files here\nor click to browse"}
//               minHeight={"195px"}
//               maxHeight={"500px"}
//               disableScroll
//               footer={false}
//               style={{ marginBottom: "5%" }}
//             >
//               {files.map((file) => (
//                 <FileItem
//                   {...file}
//                   key={file.id}
//                   onDelete={handleDelete}
//                   alwaysActive
//                   preview
//                   info
//                   elevation={1}
//                   resultOnTooltip
//                 />
//               ))}
//             </Dropzone>

//             <BasicInput
//               label="Name *"
//               name="name"
//               placeholder="Item name"
//               required={true}
//               type="text"
//               onChange={handleChange}
//             />
//             <AreaInput
//               label="Description *"
//               name="description"
//               placeholder="Fill in the detailed desceiption of your NFT"
//               required={true}
//               type="text"
//               onChange={handleAreaChange}
//             />
//             <BasicInput
//               label="External link *"
//               name="link"
//               placeholder="Ex: https://www.harmony.one"
//               required={true}
//               type="text"
//               onChange={handleChange}
//             />
//             <div className="quantity-price-container">
//               <div className="quantity-price-title">
//                 <h2>Choose Quantity and Price</h2>
//               </div>
//               <div className="quantity-price-input">
//                 <SpecialInput
//                   label="Amount *"
//                   name="amount"
//                   placeholder="0"
//                   required={true}
//                   type="number"
//                   onChange={handleChange}
//                 />

//                 <SpecialInput
//                   label="Price *"
//                   name="price"
//                   placeholder="0"
//                   required={true}
//                   type="number"
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             <MintButton label={"Create"} disabled={files.length === 0} />
//           </Stack>
//         )}
//       </div>
//     </form>
//   );
// };

// export default Mint;
