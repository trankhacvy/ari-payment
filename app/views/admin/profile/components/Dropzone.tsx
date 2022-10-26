import { useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
// Assets

const MAX_FILE_COUNT = 3;
const MAX_SIZE_BYTES = 5242880; // 5MB

type UploadFile = File & { preview?: string };

interface DropzoneProps {
  content: JSX.Element | string;
  [x: string]: any;
  onChange?: (files: Array<File>) => void;
}

function Dropzone(props: DropzoneProps) {
  const { content, onChange, ...rest } = props;
  const [files, setFiles] = useState<Array<UploadFile>>([]);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: MAX_FILE_COUNT,
    maxSize: MAX_SIZE_BYTES,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (
        files.length + acceptedFiles.length + rejectedFiles.length >
        MAX_FILE_COUNT
      ) {
        return;
      } else if (
        rejectedFiles.some((file) => file.file.size > MAX_SIZE_BYTES)
      ) {
        return;
      }

      const uniqueFiles = acceptedFiles.filter((item) => {
        return !files.find(
          (file) =>
            file.name === item.name && file.lastModified === item.lastModified
        );
      });

      const newFiles = [
        ...files,
        ...uniqueFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ].slice(0, MAX_FILE_COUNT);

      setFiles(newFiles);
      onChange && onChange(newFiles);
    },
  });

  const bg = useColorModeValue("gray.100", "navy.700");
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange && onChange(newFiles);
  };

  const thumbs = files.map((file: UploadFile, index) => (
    <Box position="relative" key={file.name}>
      <IconButton
        aria-label="Remove"
        icon={<CloseIcon />}
        size="sm"
        colorScheme="brand"
        position="absolute"
        right="0"
        zIndex={10}
        transform="translate(50%, -50%)"
        onClick={() => removeFile(index)}
      />
      <Image
        boxSize="150px"
        objectFit="cover"
        rounded="md"
        src={file.preview}
        alt={file.name}
        onLoad={() => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview);
          }
        }}
      />
    </Box>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () =>
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <Box>
      <Flex
        align="center"
        justify="center"
        bg={bg}
        border="1px dashed"
        borderColor={borderColor}
        borderRadius="16px"
        w="100%"
        h="max-content"
        minH="100%"
        cursor="pointer"
        {...getRootProps({ className: "dropzone" })}
        {...rest}
      >
        <input {...getInputProps()} />
        <Button
          h="auto"
          variant="no-effects"
          disabled={files.length === MAX_FILE_COUNT}
        >
          {content}
        </Button>
      </Flex>
      <HStack mt="24px" gap={4}>
        {thumbs}
      </HStack>
    </Box>
  );
}

export default Dropzone;
