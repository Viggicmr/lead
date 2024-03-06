/* eslint-disable no-restricted-globals */
/* eslint-disable @nx/workspace-styled-components-prefixed-with-styled */
import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import {
  Checkbox,
  CheckboxShape,
  CheckboxSize,
  CheckboxVariant,
  Select,
  TextInput,
} from 'tsup.ui.index';
import { v4 as uuidv4 } from 'uuid';

import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { IconMail } from '@/ui/display/icon';
import { H1Title } from '@/ui/display/typography/components/H1Title';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { Button } from '@/ui/input/button/components/Button';
import DateTimePicker from '@/ui/input/components/internal/date/components/DateTimePicker';
import { SubMenuTopBarContainer } from '@/ui/layout/page/SubMenuTopBarContainer';
import { Section } from '@/ui/layout/section/components/Section';
import { ADD_CAMPAIGN } from '@/users/graphql/queries/addCampaign';
import { GET_SPECIALTY } from '@/users/graphql/queries/getSpecialtyDetails';
import { SAVE_SMS_RESPONSE } from '@/users/graphql/queries/saveSmsResponse';

const StyledH1Title = styled(H1Title)`
  margin-bottom: 0;
`;

const StyledSection = styled(Section)`
  align-items: center;
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
  margin-left: 0;
`;

const SaveButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: auto;
`;

const StyledLabel = styled.span`
  color: ${({ theme }) => theme.font.color.light};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  text-transform: uppercase;
`;

const StyledCheckboxLabel = styled.label`
  align-items: center;
  display: flex;
`;

export const Preview = () => {
  let Specialty: any = [];

  const SpecialtyTypes: any = {};

  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [subSpecialty, setSubSpecialty] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedMessaging, setSelectedMessaging] = useState(new Set());
  const { loading: queryLoading, data: queryData } = useQuery(GET_SPECIALTY);

  const [showSmsInput, setShowSmsInput] = useState(false);
  const [smsMessage, setSmsMessage] = useState('');

  if (!queryLoading) {
    const specialtyTypes = queryData?.subspecialties.edges.map(
      (edge: { node: { specialtyType: { name: any } } }) =>
        edge?.node?.specialtyType?.name,
    );
    const uniqueSpecialtyTypes = Array.from(new Set(specialtyTypes));
    Specialty = uniqueSpecialtyTypes.map((specialtyType) => ({
      value: specialtyType,
      label: specialtyType,
    }));

    queryData?.subspecialties.edges.forEach(
      (edge: { node: { specialtyType: { name: any }; name: any } }) => {
        const specialtyType = edge.node.specialtyType.name;
        const subSpecialty = edge.node.name;

        // If the specialty type is already a key in the dictionary, push the sub-specialty to its array
        if (SpecialtyTypes[specialtyType]) {
          SpecialtyTypes[specialtyType].push({
            value: subSpecialty,
            label: subSpecialty,
          });
        } else {
          // If the specialty type is not yet a key, create a new array with the sub-specialty as its first element
          SpecialtyTypes[specialtyType] = [];
          SpecialtyTypes[specialtyType].push({
            value: subSpecialty,
            label: subSpecialty,
          });
        }
      },
    );
  }

  const [addCampaigns, { loading, error }] = useMutation(ADD_CAMPAIGN);

  const [saveSmsResponse] = useMutation(SAVE_SMS_RESPONSE);

  const { enqueueSnackBar } = useSnackBar();

  const handleCampaignChange = (e: any) => {
    setCampaignName(e.target.value);
  };

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

  const handleSpecialtySelectChange = (selectedValue: any) => {
    setSpecialty(selectedValue);
  };

  const handleSubSpecialtySelectChange = (selectedValue: any) => {
    setSubSpecialty(selectedValue);
  };

  const onSelectCheckBoxChange = (event: any, checkedOption: string) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedMessaging(selectedMessaging.add(checkedOption));
      if (checkedOption === 'SMS') {
        setShowSmsInput(true);
      }
    } else {
      selectedMessaging.delete(checkedOption);
      setSelectedMessaging(selectedMessaging);
      if (checkedOption === 'SMS') {
        setShowSmsInput(false);
      }
    }
  };
  const resetCampaignData = () => {
    setCampaignName('');
    setDescription('');
    setStartDate(new Date());
    setSelectedMessaging(new Set());
    setSpecialty('');
    setSubSpecialty('');
  };
  const saveSMSResponse = async (response: any, campaignName: string) => {
    const variables = {
      input: {
        id: uuidv4(),
        campaignName: campaignName,
        sid: response.sid,
        status: response.status,
        dateCreated: response.date_created,
        to: response.to,
        body: response.body,
      },
    };

    const { data } = await saveSmsResponse({
      variables: variables,
    });

    enqueueSnackBar('SMS response Saved Successfully', {
      variant: 'success',
    });

    console.log('ashahsuahsh', data);
  };
  const handleSave = async () => {
    try {
      console.log('Start Date', startDate);

      console.log('End Date', endDate);
      const variables = {
        input: {
          id: uuidv4(),
          campaignName: campaignName,
          specialtyType: specialty,
          description: description,
          subSpecialtyType: subSpecialty,
          startDate: startDate,
          endDate: endDate,
          messagingMedia: Array.from(selectedMessaging).join(' '),
        },
      };
      console.log('Variables', variables);

      const { data } = await addCampaigns({
        variables: variables,
      });
      enqueueSnackBar('Campaign added successfully', {
        variant: 'success',
      });

      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
      myHeaders.append(
        'Authorization',
        'Basic QUM1ZGQxNjZiMDhjN2M3MGQ0YzZjNDM1N2I2OTFkODMwZjo0NDdmZmU0OWU1N2VhZmM4ZmIxNjAxZDNiOGEwMDVjYg==',
      );

      const urlencoded = new URLSearchParams();
      enqueueSnackBar('SMS sent successfully', {
        variant: 'success',
      });
      urlencoded.append('To', ' 919108223419');
      urlencoded.append('From', ' 16506035403');
      urlencoded.append('Body', smsMessage);

      const requestOptions: Object = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow',
      };

      const response: any = await fetch(
        'https://api.twilio.com/2010-04-01/Accounts/AC5dd166b08c7c70d4c6c4357b691d830f/Messages.json',
        requestOptions,
      ).catch((error) => console.error(error));
      const respData = await response.json();

      if (respData.body) {
        enqueueSnackBar('SMS sent successfully', {
          variant: 'success',
        });

        await saveSMSResponse(respData, campaignName);
      }

      resetCampaignData();
    } catch (errors: any) {
      console.error('Error updating user:', error);
      enqueueSnackBar(errors.message + 'Error while Submitting Campaign', {
        variant: 'error',
      });
    }
  };
  return (
    <SubMenuTopBarContainer Icon={IconMail} title="Campaign">
      <SettingsPageContainer>
        <StyledH1Title title="Campaign" />
        <Section>
          <TextInput
            label="Campaign Name"
            value={campaignName}
            // eslint-disable-next-line no-restricted-globals
            onChange={() => handleCampaignChange(event)}
            placeholder="Campaign Name"
            name="campaignName"
            required
            fullWidth
          />
        </Section>
        <Section>
          <TextInput
            label="Description"
            value={description}
            onChange={() => handleDescriptionChange(event)}
            placeholder="Description about campaign"
            name="description"
            required
            fullWidth
          />
        </Section>
        <Section>
          <Select
            fullWidth
            // disabled
            label="Specialty Type"
            dropdownId="Specialty Type"
            value={specialty}
            options={Specialty}
            onChange={handleSpecialtySelectChange}
          />
        </Section>
        {specialty && (
          <Section>
            <Select
              fullWidth
              // disabled
              label="Sub Specialty Type"
              dropdownId="Sub Specialty Type"
              value={subSpecialty}
              options={SpecialtyTypes[specialty]}
              onChange={handleSubSpecialtySelectChange}
            />
          </Section>
        )}
        <Section>
          <StyledLabel>Start Date</StyledLabel>
          <DateTimePicker
            onChange={(startDate) => setStartDate(startDate)}
            minDate={new Date()}
          />
        </Section>
        <Section>
          <StyledLabel>End Date</StyledLabel>
          <DateTimePicker
            onChange={(endDate) => setEndDate(endDate)}
            minDate={startDate}
          />
        </Section>

        <StyledLabel>Messaging</StyledLabel>
        <StyledSection>
          <StyledCheckboxLabel htmlFor="sms-checkbox">
            <Checkbox
              // id="sms-checkbox"
              checked={false}
              indeterminate={false}
              onChange={(event) => onSelectCheckBoxChange(event, 'SMS')}
              variant={CheckboxVariant.Primary}
              size={CheckboxSize.Small}
              shape={CheckboxShape.Squared}
            />
            SMS
          </StyledCheckboxLabel>

          <StyledCheckboxLabel htmlFor="whatsapp-checkbox">
            <Checkbox
              // id="whatsapp-checkbox"
              checked={false}
              indeterminate={false}
              onChange={(event) => onSelectCheckBoxChange(event, 'Whatsapp')}
              variant={CheckboxVariant.Primary}
              size={CheckboxSize.Small}
              shape={CheckboxShape.Squared}
            />
            WhastApp
          </StyledCheckboxLabel>

          <StyledCheckboxLabel htmlFor="gbm-checkbox">
            <Checkbox
              // id="gbm-checkbox"
              checked={false}
              indeterminate={false}
              onChange={(event) => onSelectCheckBoxChange(event, 'GBM')}
              variant={CheckboxVariant.Primary}
              size={CheckboxSize.Small}
              shape={CheckboxShape.Squared}
            />
            GBM
          </StyledCheckboxLabel>

          <StyledCheckboxLabel htmlFor="call-checkbox">
            <Checkbox
              // id="call-checkbox"
              checked={false}
              indeterminate={false}
              onChange={(event) => onSelectCheckBoxChange(event, 'Call')}
              variant={CheckboxVariant.Primary}
              size={CheckboxSize.Small}
              shape={CheckboxShape.Squared}
            />
            Call
          </StyledCheckboxLabel>
        </StyledSection>
        <StyledCheckboxLabel>
          {showSmsInput && (
            <Section>
              <StyledLabel>SMS Message Body</StyledLabel>
              <TextInput
                value={smsMessage}
                onChange={(value) => setSmsMessage(value)}
                placeholder="Enter SMS message body"
                fullWidth
              />
            </Section>
          )}
        </StyledCheckboxLabel>

        <SaveButtonContainer>
          <Button
            title="Save"
            variant="primary"
            accent="blue"
            size="medium"
            onClick={(event) => handleSave()}
          />
        </SaveButtonContainer>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
