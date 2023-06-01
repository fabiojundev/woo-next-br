import Image from "./image";

const LoadingImg = (props) => {
  return (
    <span className="align-middle h-full inline-block" {...props}>
      <Image
        src="/cart-spinner.gif"
        width="54px"
        height="54px"
        alt="Carregando..."
        className={"mt-4"}
      />
    </span>
  );
};

export default LoadingImg;
