import { useEffect, useState } from "react";
import { useUpdateEvidenceMutation } from "../../../api/query-hooks/mutations/evidence";
import { Evidence } from "../../../api/services/evidence";
import { Modal } from "../../Modal";
import { ManualDoDInput } from "../AddDefinitionOfDone/AddManualDefinitionOfDone";

type Props = {
  evidence: Evidence;
  onCloseModal: () => void;
  isOpen: boolean;
  onSuccess: () => void;
};

export default function EditEvidenceDefinitionOfDoneComment({
  evidence,
  onCloseModal,
  isOpen,
  onSuccess
}: Props) {
  console.log("evidence", evidence);
  const [comment, setComment] = useState<string>();

  useEffect(() => {
    setComment(evidence.evidence?.comment);
  }, [evidence.evidence?.comment]);

  const { isLoading, mutate } = useUpdateEvidenceMutation();

  return (
    <Modal
      title={"Update Definition of Done"}
      onClose={onCloseModal}
      open={isOpen}
      bodyClass=""
      size="full"
      actions={[
        <button
          className="px-4 py-2 btn-primary"
          type="button"
          onClick={async () => {
            mutate([
              {
                id: evidence.id,
                description: comment,
                evidence: {
                  ...evidence.evidence,
                  comment
                }
              }
            ]);
            onSuccess();
          }}
        >
          {isLoading ? "Updating ..." : "Update"}
        </button>
      ]}
    >
      <div className="w-full flex flex-col space-y-4 p-4">
        <ManualDoDInput
          value={comment}
          onChange={(comment) => setComment(comment)}
        />
      </div>
    </Modal>
  );
}
