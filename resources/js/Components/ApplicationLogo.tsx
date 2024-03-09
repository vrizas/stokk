import Logo from "../../images/logo.svg";

export default function ApplicationLogo(
    props: React.ImgHTMLAttributes<HTMLImageElement>
) {
    return <img src={Logo} alt="Stokk" {...props} />;
}
