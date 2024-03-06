import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { ObjectRecord } from '@/object-record/types/ObjectRecord';
import { AppPath } from '@/types/AppPath';
import { CustomPath } from '@/types/CustomPath';
import { SettingsPath } from '@/types/SettingsPath';
import { DefaultLayout } from '@/ui/layout/page/DefaultLayout';
import { PageTitle } from '@/ui/utilities/page-title/PageTitle';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { CommandMenuEffect } from '~/effect-components/CommandMenuEffect';
import { GotoHotkeysEffect } from '~/effect-components/GotoHotkeysEffect';
import { ChooseYourPlan } from '~/pages/auth/ChooseYourPlan.tsx';
import { useDefaultHomePagePath } from '~/hooks/useDefaultHomePagePath';
import { CreateProfile } from '~/pages/auth/CreateProfile';
import { CreateWorkspace } from '~/pages/auth/CreateWorkspace';
import { PasswordReset } from '~/pages/auth/PasswordReset';
import { PaymentSuccess } from '~/pages/auth/PaymentSuccess.tsx';
import { PlanRequired } from '~/pages/auth/PlanRequired';
import { SignInUp } from '~/pages/auth/SignInUp';
import { VerifyEffect } from '~/pages/auth/VerifyEffect';
import { Campaigns } from '~/pages/campaigns/Campaigns';
import { ImpersonateEffect } from '~/pages/impersonate/ImpersonateEffect';
import { NotFound } from '~/pages/not-found/NotFound';
import { RecordIndexPage } from '~/pages/object-record/RecordIndexPage';
import { RecordShowPage } from '~/pages/object-record/RecordShowPage';
import { SettingsAccounts } from '~/pages/settings/accounts/SettingsAccounts';
import { SettingsAccountsCalendars } from '~/pages/settings/accounts/SettingsAccountsCalendars';
import { SettingsAccountsCalendarsSettings } from '~/pages/settings/accounts/SettingsAccountsCalendarsSettings';
import { SettingsAccountsEmails } from '~/pages/settings/accounts/SettingsAccountsEmails';
import { SettingsAccountsEmailsInboxSettings } from '~/pages/settings/accounts/SettingsAccountsEmailsInboxSettings';
import { SettingsNewAccount } from '~/pages/settings/accounts/SettingsNewAccount';
import { SettingsNewObject } from '~/pages/settings/data-model/SettingsNewObject';
import { SettingsObjectDetail } from '~/pages/settings/data-model/SettingsObjectDetail';
import { SettingsObjectEdit } from '~/pages/settings/data-model/SettingsObjectEdit';
import { SettingsObjectFieldEdit } from '~/pages/settings/data-model/SettingsObjectFieldEdit';
import { SettingsObjectNewFieldStep1 } from '~/pages/settings/data-model/SettingsObjectNewField/SettingsObjectNewFieldStep1';
import { SettingsObjectNewFieldStep2 } from '~/pages/settings/data-model/SettingsObjectNewField/SettingsObjectNewFieldStep2';
import { SettingsObjects } from '~/pages/settings/data-model/SettingsObjects';
import { SettingsDevelopersApiKeyDetail } from '~/pages/settings/developers/api-keys/SettingsDevelopersApiKeyDetail';
import { SettingsDevelopersApiKeysNew } from '~/pages/settings/developers/api-keys/SettingsDevelopersApiKeysNew';
import { SettingsDevelopers } from '~/pages/settings/developers/SettingsDevelopers';
import { SettingsAppearance } from '~/pages/settings/SettingsAppearance';
import { SettingsProfile } from '~/pages/settings/SettingsProfile';
import { SettingsWorkspace } from '~/pages/settings/SettingsWorkspace';
import { SettingsWorkspaceMembers } from '~/pages/settings/SettingsWorkspaceMembers';
import { Tasks } from '~/pages/tasks/Tasks';
import { AudioTemplate } from '~/pages/Templates/AudioTemplate';
import { DocumentTemplate } from '~/pages/Templates/DocumentTemplate';
import { ImageTemplate } from '~/pages/Templates/ImageTemplate';
import { TemplatesList } from '~/pages/Templates/TemplatesList';
import { TextTemplate } from '~/pages/Templates/TextTemplate';
import { VideoTemplate } from '~/pages/Templates/VideoTemplate';
import { getPageTitleFromPath } from '~/utils/title-utils';

export const App = () => {
  const isSelfBillingEnabled = useIsFeatureEnabled('IS_SELF_BILLING_ENABLED');
  const { pathname } = useLocation();
  const { defaultHomePagePath } = useDefaultHomePagePath();

  const pageTitle = getPageTitleFromPath(pathname);
  const isNewRecordBoardEnabled = useIsFeatureEnabled(
    'IS_NEW_RECORD_BOARD_ENABLED',
  );
  const myRecord: ObjectRecord = {
    id: 'unique_id',
  };

  const targetableObject = {
    id: 'string',
    targetObjectNameSingular: 'string',
    targetObjectRecord: myRecord,
    relatedTargetableObjects: undefined,
  };
  return (
    <>
      <PageTitle title={pageTitle} />
      <GotoHotkeysEffect />
      <CommandMenuEffect />
      <DefaultLayout>
        <Routes>
          <Route path={AppPath.Verify} element={<VerifyEffect />} />
          <Route path={AppPath.SignIn} element={<SignInUp />} />
          <Route path={AppPath.SignUp} element={<SignInUp />} />
          <Route path={AppPath.Invite} element={<SignInUp />} />
          <Route path={AppPath.ResetPassword} element={<PasswordReset />} />
          <Route path={AppPath.CreateWorkspace} element={<CreateWorkspace />} />
          <Route path={AppPath.CreateProfile} element={<CreateProfile />} />
          <Route
            path={AppPath.PlanRequired}
            element={
              isSelfBillingEnabled ? <ChooseYourPlan /> : <PlanRequired />
            }
          />
          <Route
            path={AppPath.PlanRequiredSuccess}
            element={<PaymentSuccess />}
          />
          <Route path={AppPath.Index} element={<DefaultHomePage />} />
          <Route path={AppPath.TasksPage} element={<Tasks />} />
          <Route path={AppPath.Impersonate} element={<ImpersonateEffect />} />
          <Route path={AppPath.RecordIndexPage} element={<RecordIndexPage />} />
          <Route path={AppPath.RecordShowPage} element={<RecordShowPage />} />

          <Route
            path={AppPath.SettingsCatchAll}
            element={
              <Routes>
                <Route
                  path={SettingsPath.ProfilePage}
                  element={<SettingsProfile />}
                />
                <Route
                  path={SettingsPath.Appearance}
                  element={<SettingsAppearance />}
                />
                <Route
                  path={SettingsPath.Accounts}
                  element={<SettingsAccounts />}
                />
                <Route
                  path={SettingsPath.NewAccount}
                  element={<SettingsNewAccount />}
                />
                <Route
                  path={SettingsPath.AccountsCalendars}
                  element={<SettingsAccountsCalendars />}
                />
                <Route
                  path={SettingsPath.AccountsCalendarsSettings}
                  element={<SettingsAccountsCalendarsSettings />}
                />
                <Route
                  path={SettingsPath.AccountsEmails}
                  element={<SettingsAccountsEmails />}
                />
                <Route
                  path={SettingsPath.AccountsEmailsInboxSettings}
                  element={<SettingsAccountsEmailsInboxSettings />}
                />
                <Route
                  path={SettingsPath.WorkspaceMembersPage}
                  element={<SettingsWorkspaceMembers />}
                />
                <Route
                  path={SettingsPath.Workspace}
                  element={<SettingsWorkspace />}
                />
                <Route
                  path={SettingsPath.Objects}
                  element={<SettingsObjects />}
                />
                <Route
                  path={SettingsPath.ObjectDetail}
                  element={<SettingsObjectDetail />}
                />
                <Route
                  path={SettingsPath.ObjectEdit}
                  element={<SettingsObjectEdit />}
                />
                <Route
                  path={SettingsPath.NewObject}
                  element={<SettingsNewObject />}
                />
                <Route
                  path={SettingsPath.Developers}
                  element={<SettingsDevelopers />}
                />
                <Route
                  path={AppPath.DevelopersCatchAll}
                  element={
                    <Routes>
                      <Route
                        path={SettingsPath.DevelopersNewApiKey}
                        element={<SettingsDevelopersApiKeysNew />}
                      />
                      <Route
                        path={SettingsPath.DevelopersApiKeyDetail}
                        element={<SettingsDevelopersApiKeyDetail />}
                      />
                    </Routes>
                  }
                />
                <Route
                  path={SettingsPath.ObjectNewFieldStep1}
                  element={<SettingsObjectNewFieldStep1 />}
                />
                <Route
                  path={SettingsPath.ObjectNewFieldStep2}
                  element={<SettingsObjectNewFieldStep2 />}
                />
                <Route
                  path={SettingsPath.ObjectFieldEdit}
                  element={<SettingsObjectFieldEdit />}
                />
              </Routes>
            }
          />

          <Route path={AppPath.NotFoundWildcard} element={<NotFound />} />

          <Route
            path={CustomPath.ImageTemplatePage}
            element={<ImageTemplate targetableObject={targetableObject} />}
          />
          <Route
            path={CustomPath.TextTemplatePage}
            element={<TextTemplate />}
          />
          <Route path={CustomPath.CampaignsPage} element={<Campaigns />} />
          <Route
            path={CustomPath.AudioTemplatePage}
            element={<AudioTemplate targetableObject={targetableObject} />}
          />
          <Route
            path={CustomPath.VideoTemplatePage}
            element={<VideoTemplate targetableObject={targetableObject} />}
          />
          <Route
            path={CustomPath.DocumentTemplatePage}
            element={<DocumentTemplate targetableObject={targetableObject} />}
          />
          <Route path={CustomPath.TemplatesPage} element={<TemplatesList />} />
        </Routes>
      </DefaultLayout>
    </>
  );
};
