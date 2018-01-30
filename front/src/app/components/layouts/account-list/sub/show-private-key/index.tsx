// import * as React from 'react';
// import { Dialog } from 'app/components/common/dialog';
// import { Button } from 'app/components/common/button';
// import { Form, FormRow, FormField } from 'app/components/common/form';
// import { getMessageText } from 'app/api/error-messages';
//
// export interface IProps {
//     className?: string;
//     onClose: () => void;
// }
//
// export class ShowPassword extends React.Component<IProps, any> {
//     public state = {
//         pasword: '',
//         isPasswordIncorrect: false,
//     }
//
//     protected handleClickCross = () => {
//         this.props.onClose();
//     }
//
//     public render() {
//
//         return (
//             <Dialog onClickCross={this.handleClickCross}>
//                 <Form>
//                     <FormRow>
//                         <FormField>
//                             <>
//                         </FormField>
//                     </FormRow>
//                     <Button
//                         className=""
//                         type="submit"
//                     >
//                         Create
//                     </Button>
//                 </Form>
//             </Dialog>
//         );
//     }
// }
//
// export default EmptyAccountList;
