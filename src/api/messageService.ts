import supabase from './supabase';
import { Message } from '../types/models';

/**
 * Get messages based on filters
 * @param filters - Object containing filter options
 * @returns Array of messages
 */
export const getMessages = async (filters: {
  receiverType?: string;
  receiverId?: string;
  senderType?: string;
  senderId?: string;
} = {}) => {
  let query = supabase
    .from('message')
    .select('*')
    .eq('is_deleted', false);

  if (filters.receiverType && filters.receiverId) {
    query = query.eq('receiver_type', filters.receiverType)
                .eq('receiver_id', filters.receiverId);
  }

  if (filters.senderType && filters.senderId) {
    query = query.eq('sender_type', filters.senderType)
                .eq('sender_id', filters.senderId);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

/**
 * Send a message
 * @param senderType - Type of sender ('admin', 'company', 'manager', 'asst_manager', 'employee')
 * @param senderId - ID of sender
 * @param receiverType - Type of receiver ('company', 'branch', 'employee')
 * @param receiverId - ID of receiver
 * @param messageText - Message content
 * @param attachmentLink - Optional attachment URL
 * @returns The created message
 */
export const sendMessage = async (
  senderType: string,
  senderId: string,
  receiverType: string,
  receiverId: string,
  messageText: string,
  attachmentLink?: string
) => {
  const { data, error } = await supabase
    .from('message')
    .insert([
      {
        sender_type: senderType,
        sender_id: senderId,
        receiver_type: receiverType,
        receiver_id: receiverId,
        message_text: messageText,
        attachment_link: attachmentLink
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Delete a message (soft delete)
 * @param messageId - ID of the message
 * @param senderType - Type of sender
 * @param senderId - ID of sender
 * @returns True if operation was successful
 */
export const deleteMessage = async (
  messageId: string,
  senderType: string,
  senderId: string
) => {
  const { error } = await supabase
    .from('message')
    .update({ 
      is_deleted: true, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', messageId)
    .eq('sender_type', senderType)
    .eq('sender_id', senderId);

  if (error) throw error;
  return true;
};

/**
 * Get message with sender and receiver details
 * @param messageId - ID of the message
 * @returns Message with additional sender and receiver information
 */
export const getMessageWithDetails = async (messageId: string) => {
  const { data: message, error } = await supabase
    .from('message')
    .select('*')
    .eq('id', messageId)
    .single();

  if (error) throw error;

  // This function would need to fetch sender and receiver names based on their types
  // For example, if sender_type is 'employee', fetch employee name from employees table
  // This is a simplified version

  // Get sender name
  let senderName = 'Unknown';
  if (message.sender_type === 'admin') {
    senderName = 'System Administrator';
  } else if (message.sender_type === 'company') {
    const { data: company } = await supabase
      .from('company')
      .select('company_name')
      .eq('id', message.sender_id)
      .single();
    senderName = company?.company_name || 'Unknown Company';
  } else { // employee, manager, asst_manager
    const { data: employee } = await supabase
      .from('employee')
      .select('employee_name')
      .eq('id', message.sender_id)
      .single();
    senderName = employee?.employee_name || 'Unknown Employee';
  }

  // Get receiver name
  let receiverName = 'Unknown';
  if (message.receiver_type === 'company') {
    const { data: company } = await supabase
      .from('company')
      .select('company_name')
      .eq('id', message.receiver_id)
      .single();
    receiverName = company?.company_name || 'Unknown Company';
  } else if (message.receiver_type === 'branch') {
    const { data: branch } = await supabase
      .from('branch')
      .select('branch_name')
      .eq('id', message.receiver_id)
      .single();
    receiverName = branch?.branch_name || 'Unknown Branch';
  } else { // employee
    const { data: employee } = await supabase
      .from('employee')
      .select('employee_name')
      .eq('id', message.receiver_id)
      .single();
    receiverName = employee?.employee_name || 'Unknown Employee';
  }

  return {
    ...message,
    sender_name: senderName,
    receiver_name: receiverName
  };
};