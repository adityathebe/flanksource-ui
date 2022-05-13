import { TextInputClearable } from "./index";

export default {
  title: "TextInputClearable",
  component: TextInputClearable
};

const Template = (arg) => <TextInputClearable {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  hideClearButton: true,
  className: "w-80",
  placeholder: "Search for configs"
  // defaultValue: ""
};
