import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GratitudeInput from '../components/GratitudeInput';
import SubmitButton from '../components/SubmitButton';
import { prepareGratitudeImage } from '../components/utils/imageUpload';

vi.mock('../components/utils/imageUpload', () => ({ prepareGratitudeImage: vi.fn() }));
afterEach(() => { cleanup(); vi.clearAllMocks(); vi.unstubAllGlobals(); });

function PhotoForm({ submit }) {
  const [image, setImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  return <>
    <GratitudeInput index={0} value="A good day" onChange={() => {}} image={image} onImageChange={setImage} onImageProcessingChange={setProcessing} />
    <SubmitButton allFilled filledCount={3} isSubmitting={false} isPreparingImages={processing} onSubmit={submit} />
  </>;
}

describe('saving while a mobile photo is being prepared', () => {
  it('waits for the prepared photo before enabling journal submission', async () => {
    let finish;
    prepareGratitudeImage.mockReturnValue(new Promise((resolve) => { finish = resolve; }));
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:preview'), revokeObjectURL: vi.fn() });
    const submit = vi.fn();
    const user = userEvent.setup();
    render(<PhotoForm submit={submit} />);
    await user.upload(screen.getByLabelText('Add an image to your first gratitude'), new File(['photo'], 'photo.jpg', { type: 'image/jpeg' }));
    const button = screen.getByRole('button', { name: 'Preparing photos…' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(submit).not.toHaveBeenCalled();
    finish(new File(['prepared'], 'photo.jpg', { type: 'image/jpeg' }));
    await waitFor(() => expect(screen.getByRole('button', { name: "Save today's gratitudes →" })).toBeEnabled());
    expect(await screen.findByRole('img', { name: 'Preview for first gratitude' })).toBeInTheDocument();
  });

  it('shows preparation errors and restores the save button', async () => {
    prepareGratitudeImage.mockRejectedValue(new Error('Choose a different photo.'));
    const user = userEvent.setup();
    render(<PhotoForm submit={vi.fn()} />);
    await user.upload(screen.getByLabelText('Add an image to your first gratitude'), new File(['photo'], 'photo.jpg', { type: 'image/jpeg' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Choose a different photo.');
    expect(screen.getByRole('button', { name: "Save today's gratitudes →" })).toBeEnabled();
  });
});
