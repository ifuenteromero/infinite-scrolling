import { IconType, IconBaseProps } from 'react-icons';
import { IoClose } from 'react-icons/io5';

const iconMap: { [key: string]: IconType } = {
	IoClose,
};

interface Props extends IconBaseProps {
	iconName: string;
}

const Icon = ({ iconName }: Props) => {
	const IconComponent = iconMap[iconName];
	return <IconComponent />;
};

export default Icon;
