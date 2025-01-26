
import { ImageUp } from 'lucide-react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface LinkUpInputFileProps {
 
  name: string;
  label: string;
}

const LinkUpInputFile: React.FC<LinkUpInputFileProps> = ({ name, label }) => {
        const {  control, formState: { errors } } = useFormContext();

        console.log("LinkUpInputFile error", errors)

        const openFileDialog = () => {
          console.log("openFileDialog cliCK")
          const fileInput = document.getElementById(`file-input-${name}`) as HTMLInputElement;
          fileInput?.click(); // Programmatically click the hidden file input
        };
  

  return (
  
    <Controller
    name={name}
    control={control}
    
    defaultValue={[]}
    render={({ field }) => {
      const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = event.target.files ? Array.from(event.target.files) : [];
        field.onChange([...(field.value || []), ...newFiles]); // Append new files
      };

      const handleRemoveFile = (index: number) => {
        const updatedFiles = field.value.filter((_: File, i: number) => i !== index);
        field.onChange(updatedFiles); // Remove file by index
      };

      return (
        <div>
            <label
              htmlFor={`file-input-${name}`}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {label}
            </label>
          {/* File Input */}
          <input id={`file-input-${name}`} className=' hidden' type="file" multiple onChange={handleFileChange} />
           {/* Trigger File Input with Icon */}
           <button
              type="button"
              onClick={openFileDialog}
              className="p-2 border rounded-md flex items-center justify-center"
            >
              <ImageUp />
            </button>

          {/* Display Uploaded Files */}
          <div className="flex gap-4 mt-4 flex-wrap">
            {field.value?.map((file: File, index: number) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                             alt={`preview-${index}`}
                              className="w-32 h-32 object-cover rounded-md border"
                            />
                            <button
                             type="button"
                             onClick={() => handleRemoveFile(index)}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            ×
                           </button>
                         </div>
                       ))}
          </div>

            {/* Error Message */}
            {errors[name]?.message && (
              <p className="text-red-500 text-sm mt-2">{errors[name]?.message as string}</p>
            )}
        </div>
      );
    }}
  />
  );
};

export default LinkUpInputFile;


// import React, { ChangeEvent, useEffect, useState } from "react";
// import { Controller, useFormContext } from "react-hook-form";

// interface ImageFileWithPreview {
//   file: File;
// }

// interface LinkUpInputFileProps {
//     name: string;
// onChange: (value: ImageFileWithPreview[]) => void;
// }

// const LinkUpInputFile: React.FC<LinkUpInputFileProps> = ({ name, onChange, }) => {
// // const LinkUpInputFile = ({  name }:any) => {
//   const [file, setFile] = useState<ImageFileWithPreview[]>([]);
//   console.log({ file})
//   console.log({name})
//   const { setValue, watch } = useFormContext();
  
//   console.log("watch(image) LINKUPINPUTFILe",watch(name))

// //   useEffect(() => {
// //     // Update form state with imageFiles on change
// //    if(name) {
// //     setValue(name, file);
// //    }
// //   }, [file, setValue]); // Add dependencies

// //   useEffect(() => {
// //     if(onChange) {
// //         onChange(file)
// //     }
// //   }, [file])
  
  

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;

//     if (files) {
//       const newFiles = Array.from(files).map((file) => ({ file }));
//       setFile((prev) => [...prev, ...newFiles]);
//     //   if(onChange) {
//     //        onChange([...file, ...newFiles])
//     //        }
//     // setValue(name, [...file, ...newFiles], { shouldDirty: true, shouldValidate: true });
//     }
//   };

//   const removeImage = (index: number) => {
//     setFile((prev) => {
//       const updatedFiles = [...prev];
//       updatedFiles.splice(index, 1);
//       return updatedFiles;
//     });
//     // setValue(name, file)
//   };

//   return (
//     <div>
//       <label
//         htmlFor={name}
//         className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md"
//       >
//         Upload Images
//       </label>
//       <input
//         id={name}
//         type="file"
//         className="hidden"
//         multiple
//         // onChange={handleImageChange}
//         onChange={ handleImageChange  }
//       />

//       <div className="flex gap-4 mt-4 flex-wrap">
//       {file.map((image, index) => (
//           <div key={index} className="relative">
//             <img
//               src={URL.createObjectURL(image.file)}
//               alt={`preview-${index}`}
//               className="w-32 h-32 object-cover rounded-md border"
//             />
//             <button
//               type="button"
//               onClick={() => removeImage(index)}
//               className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
//             >
//               ×
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LinkUpInputFile;
