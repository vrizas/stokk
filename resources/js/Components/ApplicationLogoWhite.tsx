import LogoWhite from "../../images/logo-white.svg";

export default function ApplicationLogoWhite(
    props: React.ImgHTMLAttributes<HTMLImageElement>
) {
    return <img src={LogoWhite} alt="Stokk" {...props} />;
}
