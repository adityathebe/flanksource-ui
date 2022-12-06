import { ComponentMeta, ComponentStory } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { IncidentSeverity } from "../../api/services/incident";
import { IncidentDetails } from "./index";

export default {
  title: "IncidentDetails",
  component: IncidentDetails,
  decorators: [
    (Story) => {
      const queryClient = new QueryClient();
      return (
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <Story />
          </QueryClientProvider>
        </MemoryRouter>
      );
    }
  ],
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof IncidentDetails>;

const incident = {
  id: "1aa1a99a-b487-495c-9cd9-a13cf717bc10",
  title: "Test incident 3",
  created_by: "017fb74a-9c90-2074-6b29-61d71507c231",
  commander_id: {
    name: "System",
    avatar: null
  },
  communicator_id: {
    name: "System",
    avatar: null
  },
  severity: IncidentSeverity.Low,
  description: "test",
  type: "issue",
  status: "open",
  created_at: "2022-04-05T07:19:03.546871",
  updated_at: "2022-04-05T07:19:03.546871",
  hypothesis: [
    {
      id: "401cf26e-e941-4641-b6ab-1860a484b2a2",
      created_by: {
        name: "System",
        avatar: null
      },
      incident_id: "1aa1a99a-b487-495c-9cd9-a13cf717bc10",
      parent_id: null,
      type: "root",
      title: "Test incident 3",
      status: "proven",
      created_at: "2022-04-05T07:19:04.177198",
      updated_at: "2022-04-05T07:19:04.177198"
    }
  ],
  responder: []
};

const Template: ComponentStory<typeof IncidentDetails> = (arg: any) => (
  <IncidentDetails {...arg} />
);

export const Variant1 = Template.bind({});
Variant1.args = {
  incident,
  updateStatusHandler: () => {},
  updateIncidentHandler: () => {},
  textButton: "button"
};
